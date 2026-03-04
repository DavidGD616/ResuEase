import { useState } from 'react';
import { Sparkles, Loader2, AlertCircle, Check, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AIService } from '../../../services/AiService';
import type { TextTransformMode } from '@resuease/types';

interface AiTextActionsProps {
  text: string;
  jobTitle?: string;
  sectionName: string;
  fieldLabel: string;
  onAccept: (transformedText: string) => void;
  disabled?: boolean;
}

function AiTextActions({
  text,
  jobTitle,
  sectionName,
  fieldLabel,
  onAccept,
  disabled = false,
}: AiTextActionsProps) {
  const { t } = useTranslation();
  const [activeMode, setActiveMode] = useState<TextTransformMode | null>(null);
  const [preview, setPreview] = useState<{ text: string; mode: TextTransformMode } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const ACTIONS: { mode: TextTransformMode; label: string; loadingLabel: string }[] = [
    { mode: 'rewrite', label: t('ai.textActions.rewrite'), loadingLabel: t('ai.textActions.rewriting') },
    { mode: 'add-metrics', label: t('ai.textActions.addMetrics'), loadingLabel: t('ai.textActions.addingMetrics') },
    { mode: 'make-stronger', label: t('ai.textActions.makeStronger'), loadingLabel: t('ai.textActions.makingStronger') },
  ];

  const MODE_DISPLAY: Record<TextTransformMode, string> = {
    rewrite: t('ai.textActions.rewrite'),
    'add-metrics': t('ai.textActions.addMetrics'),
    'make-stronger': t('ai.textActions.makeStronger'),
  };

  const isTextEmpty = text.length === 0;
  const isTextTooLong = text.length > 2000;
  const buttonsDisabled = disabled || isTextEmpty || isTextTooLong || activeMode !== null;

  const handleTransform = async (mode: TextTransformMode) => {
    setActiveMode(mode);
    setPreview(null);
    setError(null);

    const result = await AIService.transformText({
      text,
      mode,
      jobTitle,
      sectionName,
      fieldLabel,
    });

    if (result.success) {
      setPreview({ text: result.data.transformedText, mode });
    } else {
      setError(result.error || t('ai.textActions.error'));
    }

    setActiveMode(null);
  };

  const handleAccept = () => {
    if (preview !== null) {
      onAccept(preview.text);
      setPreview(null);
    }
  };

  const handleDiscard = () => {
    setPreview(null);
    setError(null);
  };

  return (
    <div className="mt-1.5">
      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        {ACTIONS.map(({ mode, label, loadingLabel }) => {
          const isThisLoading = activeMode === mode;
          const isOtherLoading = activeMode !== null && activeMode !== mode;
          const isDisabledState = isOtherLoading || disabled || isTextEmpty || isTextTooLong;

          return (
            <button
              key={mode}
              type="button"
              onClick={() => handleTransform(mode)}
              disabled={buttonsDisabled}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-150"
              style={
                isThisLoading
                  ? { border: '1px solid #c4b5fd', color: '#7c3aed', background: 'rgba(139,92,246,0.06)', cursor: 'not-allowed' }
                  : isDisabledState
                  ? { border: '1px solid var(--border)', color: 'var(--ink-3)', background: 'white', cursor: 'not-allowed' }
                  : { border: '1px solid var(--border)', color: 'var(--ink-3)', background: 'white' }
              }
              onMouseEnter={e => {
                if (!buttonsDisabled) {
                  e.currentTarget.style.borderColor = '#c4b5fd';
                  e.currentTarget.style.color = '#7c3aed';
                  e.currentTarget.style.backgroundColor = 'rgba(139,92,246,0.05)';
                }
              }}
              onMouseLeave={e => {
                if (!buttonsDisabled) {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.color = 'var(--ink-3)';
                  e.currentTarget.style.backgroundColor = 'white';
                }
              }}
            >
              {isThisLoading ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  {loadingLabel}
                </>
              ) : (
                <>
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  {label}
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Error */}
      {error && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Preview panel */}
      {preview !== null && (
        <div
          className="mt-3 p-4 bg-white rounded-lg shadow-sm"
          style={{ border: '1px solid var(--border)' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <h4 className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>
              {t('ai.textActions.suggestionHeader', { mode: MODE_DISPLAY[preview.mode] })}
            </h4>
          </div>

          <p className="text-sm whitespace-pre-wrap mb-4" style={{ color: 'var(--ink-2)' }}>{preview.text}</p>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAccept}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-full transition-colors duration-150"
            >
              <Check className="w-3 h-3" />
              {t('ai.textActions.accept')}
            </button>
            <button
              type="button"
              onClick={handleDiscard}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 text-xs font-medium rounded-full transition-colors duration-150"
              style={{
                color: 'var(--ink-2)',
                border: '1px solid var(--border)',
              }}
            >
              <X className="w-3 h-3" />
              {t('ai.textActions.discard')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AiTextActions;
