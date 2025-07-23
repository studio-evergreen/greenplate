'use client';

import { useState, useEffect } from 'react';
import { Settings, Shield, BarChart3, Target } from 'lucide-react';
import Button from './Button';
import { Modal, ModalHeader, ModalBody, ModalFooter } from './Modal';
import { useLanguage } from './LanguageProvider';
import { useToast } from './ToastProvider';
import { consentManager } from '@/lib/utils/consent-manager';
import { CookieConsent } from '@/lib/utils/cookies';

export default function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [consent, setConsent] = useState<Partial<CookieConsent>>({
    necessary: true,
    analytics: false,
    marketing: false
  });
  const { t } = useLanguage();
  const { showToast } = useToast();

  useEffect(() => {
    checkConsentStatus();
  }, []);

  const checkConsentStatus = async () => {
    const hasConsent = await consentManager.hasValidConsent();
    setShowBanner(!hasConsent);
  };

  const handleAcceptAll = async () => {
    try {
      await consentManager.acceptAll();
      setShowBanner(false);
      showToast({
        type: 'success',
        title: t('consent.toastSavedAllTitle'),
        message: t('consent.toastSavedAllMessage')
      });
      
      // 페이지 새로고침으로 Analytics 활성화
      window.location.reload();
    } catch (error) {
      console.error('Failed to save consent:', error);
      showToast({
        type: 'error',
        title: t('consent.toastErrorTitle'),
        message: t('consent.toastErrorMessage')
      });
    }
  };

  const handleAcceptNecessary = async () => {
    try {
      await consentManager.acceptNecessaryOnly();
      setShowBanner(false);
      showToast({
        type: 'info',
        title: t('consent.toastSavedNecessaryTitle'),
        message: t('consent.toastSavedNecessaryMessage')
      });
    } catch (error) {
      console.error('Failed to save consent:', error);
      showToast({
        type: 'error',
        title: '저장 실패', 
        message: '설정을 저장하는데 실패했습니다.'
      });
    }
  };

  const handleCustomSave = async () => {
    try {
      await consentManager.saveConsent(consent);
      setShowModal(false);
      setShowBanner(false);
      showToast({
        type: 'success',
        title: t('consent.toastSavedCustomTitle'),
        message: t('consent.toastSavedCustomMessage')
      });
      
      // Analytics가 허용된 경우 페이지 새로고침
      if (consent.analytics) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to save consent:', error);
      showToast({
        type: 'error',
        title: t('consent.toastErrorTitle'),
        message: t('consent.toastErrorMessage')
      });
    }
  };

  if (!showBanner) return null;

  return (
    <>
      {/* 쿠키 동의 배너 */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {t('consent.title')}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {t('consent.description')}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowModal(true)}
                leftIcon={<Settings size={16} />}
                className="text-gray-600 dark:text-gray-300"
              >
                {t('consent.settings')}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleAcceptNecessary}
                className="border-gray-300 dark:border-gray-600"
              >
                {t('consent.acceptNecessary')}
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleAcceptAll}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {t('consent.acceptAll')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 상세 설정 모달 */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
        <ModalHeader>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            {t('consent.modalTitle')}
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-6">
            <p className="text-gray-600 dark:text-gray-300">
              {t('consent.modalDescription')}
            </p>

            {/* 필수 쿠키 */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-green-600" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {t('consent.necessaryTitle')}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {t('consent.necessaryDescription')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-green-600">{t('consent.necessaryAlwaysActive')}</span>
                </div>
              </div>
            </div>

            {/* 분석 쿠키 */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {t('consent.analyticsTitle')}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {t('consent.analyticsDescription')}
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent.analytics}
                    onChange={(e) => setConsent(prev => ({ ...prev, analytics: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
                </label>
              </div>
            </div>

            {/* 마케팅 쿠키 */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-purple-600" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {t('consent.marketingTitle')}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {t('consent.marketingDescription')}
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent.marketing}
                    onChange={(e) => setConsent(prev => ({ ...prev, marketing: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
                </label>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="secondary"
            onClick={() => setShowModal(false)}
          >
            {t('consent.modalCancel')}
          </Button>
          <Button
            variant="primary"
            onClick={handleCustomSave}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {t('consent.modalSave')}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}