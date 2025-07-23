/**
 * 실제 코드베이스에서 사용되는 번역 키를 스캔하여 누락된 번역을 감지하는 테스트
 */
import fs from 'fs';
import path from 'path';
import enTranslations from '@/locales/en.json';
import koTranslations from '@/locales/ko.json';

/**
 * 파일 내용에서 t('key') 패턴을 찾아 번역 키를 추출
 */
function extractTranslationKeys(content: string): string[] {
  const patterns = [
    // t("key") 또는 t('key') 패턴
    /t\(["']([a-zA-Z][a-zA-Z0-9_.]*[a-zA-Z0-9])["']\)/g,
    // translationKey: 'key' 패턴 (auth-errors.ts 등에서 사용)
    /translationKey:\s*["']([a-zA-Z][a-zA-Z0-9_.]*[a-zA-Z0-9])["']/g,
  ];

  const keys: string[] = [];
  
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const key = match[1];
      // 유효한 번역 키 형식인지 확인 (문자로 시작하고, 점으로 구분된 경로)
      if (key && /^[a-zA-Z][a-zA-Z0-9]*(\.[a-zA-Z][a-zA-Z0-9]*)*$/.test(key)) {
        keys.push(key);
      }
    }
  });

  return [...new Set(keys)]; // 중복 제거
}

/**
 * 디렉토리를 재귀적으로 스캔하여 TypeScript 파일들을 찾음
 */
function getAllTsFiles(dir: string): string[] {
  const files: string[] = [];
  
  function scan(currentDir: string) {
    try {
      const items = fs.readdirSync(currentDir);
      
      for (const item of items) {
        // 제외할 디렉토리들
        if (['node_modules', '__tests__', 'dist', '.next', '.git'].includes(item)) {
          continue;
        }
        
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          scan(fullPath);
        } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // 권한 없는 디렉토리는 무시
    }
  }
  
  scan(dir);
  return files;
}

/**
 * 특정 디렉토리의 TypeScript 파일들을 스캔하여 번역 키 추출
 */
function scanTranslationKeys(directory: string): string[] {
  const files = getAllTsFiles(directory);  
  const allKeys = new Set<string>();
  
  files.forEach(filePath => {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const keys = extractTranslationKeys(content);
      keys.forEach(key => allKeys.add(key));
    } catch (error) {
      // 파일 읽기 실패는 무시
    }
  });
  
  return Array.from(allKeys).sort();
}

/**
 * 중첩된 객체를 flat한 키로 변환
 */
function flattenTranslations(obj: any, prefix = ''): Record<string, string> {
  const flattened: Record<string, string> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(flattened, flattenTranslations(value, newKey));
    } else {
      flattened[newKey] = String(value);
    }
  }
  
  return flattened;
}

describe('실제 코드베이스 번역 키 스캔', () => {
  let usedTranslationKeys: string[];
  let flatEnTranslations: Record<string, string>;
  let flatKoTranslations: Record<string, string>;

  beforeAll(() => {
    // 실제 코드베이스에서 사용되는 번역 키들을 스캔
    const appKeys = scanTranslationKeys('app');
    const libKeys = scanTranslationKeys('lib');
    
    usedTranslationKeys = [...new Set([...appKeys, ...libKeys])].sort();
    
    flatEnTranslations = flattenTranslations(enTranslations);
    flatKoTranslations = flattenTranslations(koTranslations);

    console.log(`🔍 스캔된 번역 키 개수: ${usedTranslationKeys.length}`);
    console.log(`📝 영어 번역 키 개수: ${Object.keys(flatEnTranslations).length}`);
    console.log(`🇰🇷 한국어 번역 키 개수: ${Object.keys(flatKoTranslations).length}`);
  });

  describe('누락된 번역 키 감지', () => {
    it('🚨 실제 코드에서 사용되는 모든 키가 영어 번역에 존재해야 함', () => {
      const missingInEn = usedTranslationKeys.filter(key => !flatEnTranslations[key]);
      
      if (missingInEn.length > 0) {
        console.error('❌ 영어 번역에서 누락된 키들:');
        missingInEn.forEach(key => console.error(`  - ${key}`));
      }

      expect(missingInEn).toHaveLength(0);
    });

    it('🚨 실제 코드에서 사용되는 모든 키가 한국어 번역에 존재해야 함', () => {
      const missingInKo = usedTranslationKeys.filter(key => !flatKoTranslations[key]);
      
      if (missingInKo.length > 0) {
        console.error('❌ 한국어 번역에서 누락된 키들:');
        missingInKo.forEach(key => console.error(`  - ${key}`));
      }

      expect(missingInKo).toHaveLength(0);
    });
  });

  describe('사용되지 않는 번역 키 감지', () => {
    it('ℹ️ 사용되지 않는 번역 키들 리포트 (정보용)', () => {
      const unusedKeys = Object.keys(flatEnTranslations).filter(
        key => !usedTranslationKeys.includes(key)
      );

      if (unusedKeys.length > 0) {
        console.warn(`⚠️ 사용되지 않는 가능성이 있는 번역 키들 (${unusedKeys.length}개):`);
        unusedKeys.slice(0, 10).forEach(key => console.warn(`  - ${key}`));
        if (unusedKeys.length > 10) {
          console.warn(`  ... 그리고 ${unusedKeys.length - 10}개 더`);
        }
      }

      // 이 테스트는 정보 제공 목적이므로 항상 통과
      expect(unusedKeys.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('특정 패턴의 번역 키 검증', () => {
    it('🔍 auth.errors.* 패턴의 키들이 모두 번역되어야 함', () => {
      const authErrorKeys = usedTranslationKeys.filter(key => key.startsWith('auth.errors.'));
      const missingAuthErrors = authErrorKeys.filter(key => 
        !flatEnTranslations[key] || !flatKoTranslations[key]
      );

      if (missingAuthErrors.length > 0) {
        console.error('❌ 누락된 인증 에러 번역 키들:');
        missingAuthErrors.forEach(key => {
          console.error(`  - ${key}`);
          console.error(`    EN: ${flatEnTranslations[key] ? '✅' : '❌'}`);
          console.error(`    KO: ${flatKoTranslations[key] ? '✅' : '❌'}`);
        });
      }

      expect(missingAuthErrors).toHaveLength(0);
    });

    it('🔍 consent.* 패턴의 키들이 모두 번역되어야 함', () => {
      const consentKeys = usedTranslationKeys.filter(key => key.startsWith('consent.'));
      const missingConsentKeys = consentKeys.filter(key => 
        !flatEnTranslations[key] || !flatKoTranslations[key]
      );

      if (missingConsentKeys.length > 0) {
        console.error('❌ 누락된 쿠키 동의 관련 번역 키들:');
        missingConsentKeys.forEach(key => {
          console.error(`  - ${key}`);
          console.error(`    EN: ${flatEnTranslations[key] ? '✅' : '❌'}`);
          console.error(`    KO: ${flatKoTranslations[key] ? '✅' : '❌'}`);
        });
      }

      expect(missingConsentKeys).toHaveLength(0);
    });
  });

  describe('디버깅 정보', () => {
    it('📊 사용되는 번역 키 통계 출력', () => {
      const keysByCategory = usedTranslationKeys.reduce((acc, key) => {
        const category = key.split('.')[0];
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      console.log('📊 카테고리별 번역 키 사용 통계:');
      Object.entries(keysByCategory)
        .sort(([,a], [,b]) => b - a)
        .forEach(([category, count]) => {
          console.log(`  ${category}: ${count}개`);
        });

      // 항상 통과하는 정보성 테스트
      expect(Object.keys(keysByCategory).length).toBeGreaterThan(0);
    });

    it('🔍 모든 사용된 번역 키 리스트 출력 (디버깅용)', () => {
      console.log('🔍 실제 코드에서 사용되는 모든 번역 키들:');
      usedTranslationKeys.forEach(key => {
        const enExists = flatEnTranslations[key] ? '✅' : '❌';
        const koExists = flatKoTranslations[key] ? '✅' : '❌';
        console.log(`  ${key} (EN: ${enExists}, KO: ${koExists})`);
      });

      expect(usedTranslationKeys.length).toBeGreaterThan(0);
    });
  });
});