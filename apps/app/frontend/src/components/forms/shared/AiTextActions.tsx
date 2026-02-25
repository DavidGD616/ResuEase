import { useState } from 'react';
import { Sparkles, Loader2, AlertCircle, Check, X } from 'lucide-react';
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

const ACTIONS: { mode: TextTransformMode; label: string; loadingLabel: string }[] = [
  { mode: 'rewrite', label: 'Rewrite', loadingLabel: 'Rewriting…' },
  { mode: 'add-metrics', label: 'Add metrics', loadingLabel: 'Adding metrics…' },
  { mode: 'make-stronger', label: 'Make stronger', loadingLabel: 'Making stronger…' },
];

const MODE_DISPLAY: Record<TextTransformMode, string> = {
  rewrite: 'Rewrite',
  'add-metrics': 'Add metrics',
  'make-stronger': 'Make stronger',
};

function AiTextActions({
  text,
  jobTitle,
  sectionName,
  fieldLabel,
  onAccept,
  disabled = false,
}: AiTextActionsProps) {
  const [activeMode, setActiveMode] = useState<TextTransformMode | null>(null);
  const [preview, setPreview] = useState<{ text: string; mode: TextTransformMode } | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      setError(result.error || 'Failed to transform text. Please try again.');
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
    <div className="mt-2">
      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        {ACTIONS.map(({ mode, label, loadingLabel }) => {
          const isThisLoading = activeMode === mode;
          const isOtherLoading = activeMode !== null && activeMode !== mode;

          return (
            <button
              key={mode}
              type="button"
              onClick={() => handleTransform(mode)}
              disabled={buttonsDisabled}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-all duration-150
                ${
                  isThisLoading
                    ? 'border-blue-300 text-blue-600 bg-blue-50 cursor-not-allowed'
                    : isOtherLoading || disabled || isTextEmpty || isTextTooLong
                    ? 'border-gray-200 text-gray-400 bg-white cursor-not-allowed'
                    : 'border-gray-300 text-gray-600 bg-white hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50'
                }
              `}
            >
              {isThisLoading ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  {loadingLabel}
                </>
              ) : (
                <>
                  <Sparkles className="w-3 h-3" />
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
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Preview panel */}
      {preview !== null && (
        <div className="mt-3 p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <h4 className="text-sm font-semibold text-gray-900">
              AI Suggestion — {MODE_DISPLAY[preview.mode]}
            </h4>
          </div>

          <p className="text-sm text-gray-700 whitespace-pre-wrap mb-4">{preview.text}</p>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAccept}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors duration-150"
            >
              <Check className="w-3 h-3" />
              Accept
            </button>
            <button
              type="button"
              onClick={handleDiscard}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-700 text-xs font-medium rounded-md border border-gray-300 hover:border-gray-400 transition-colors duration-150"
            >
              <X className="w-3 h-3" />
              Discard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AiTextActions;
