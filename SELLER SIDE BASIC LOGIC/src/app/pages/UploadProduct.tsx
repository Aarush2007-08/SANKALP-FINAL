import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Upload, Mic, MicOff, Sparkles, Tag, DollarSign, Instagram } from 'lucide-react';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import { useApp } from '../contexts/AppContext';
import { api, type GenerateListingResult } from '../api/client';
import { speechLocales } from '../../i18n';
import PageHeader from '../components/layout/PageHeader';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { cn } from '../components/ui/utils';

const STEPS = ['stepImage', 'stepDescribe', 'stepAI', 'stepPublish'] as const;

export default function UploadProduct() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { addProduct } = useApp();

  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<GenerateListingResult | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const stepIndex = !image ? 0 : !description ? 1 : !aiResult ? 2 : 3;
  const displayStep = Math.max(currentStep, stepIndex);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      toast.error('Image must be under 3MB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
      setCurrentStep(1);
    };
    reader.readAsDataURL(file);
  };

  const startVoiceInput = () => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      return;
    }

    const SR = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SR) {
      toast.error(t('upload.voiceUnsupported'));
      return;
    }

    const recognition = new SR();
    recognition.lang = speechLocales[i18n.language] ?? 'en-IN';
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setIsListening(false);
      recognitionRef.current = null;
      if (event.error === 'not-allowed') toast.error(t('upload.micDenied'));
      else if (event.error !== 'aborted') toast.error(`${event.error}`);
    };
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join(' ');
      setDescription((prev) => (prev ? `${prev} ` : '') + transcript);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const generateAIData = async () => {
    if (!description.trim()) {
      toast.error(t('upload.describeFirst'));
      return;
    }

    setIsGenerating(true);
    setCurrentStep(2);
    try {
      const result = await api.generateListing(description, i18n.language);
      setAiResult(result);
      setCurrentStep(3);
    } catch {
      toast.error(t('common.error'));
    } finally {
      setIsGenerating(false);
    }
  };

  const updateAiField = <K extends keyof GenerateListingResult>(key: K, value: GenerateListingResult[K]) => {
    if (!aiResult) return;
    setAiResult({ ...aiResult, [key]: value });
  };

  const handlePublish = async () => {
    if (!aiResult || !image) {
      toast.error(t('upload.publishNeed'));
      return;
    }

    await addProduct({
      image,
      title: aiResult.title,
      description: aiResult.ecommerceDescription,
      price: aiResult.price,
      category: aiResult.category,
      caption: aiResult.caption,
      hashtags: aiResult.hashtags,
      artisan: 'Rural Women Artisan',
    });

    confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
    toast.success(t('upload.published'));
    navigate('/storefront');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader title={t('upload.title')} icon={<Sparkles className="w-9 h-9 text-brand-accent" />} />

      <div className="flex justify-between mb-8 gap-2">
        {STEPS.map((step, i) => (
          <div key={step} className="flex-1 flex flex-col items-center gap-1">
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors',
                i <= displayStep
                  ? 'bg-brand-primary border-brand-primary text-white'
                  : 'border-border text-muted-foreground'
              )}
            >
              {i + 1}
            </div>
            <span className="text-[10px] sm:text-xs text-muted-foreground text-center">
              {t(`upload.${step}`)}
            </span>
          </div>
        ))}
      </div>

      <Card className="border-border/60 shadow-xl">
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div>
            <Label className="text-base mb-3 block">{t('upload.productImage')}</Label>
            <div
              className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-brand-primary/50 transition-colors cursor-pointer"
              onClick={() => !image && fileInputRef.current?.click()}
            >
              {image ? (
                <div className="relative inline-block">
                  <img src={image} alt="" className="max-h-56 mx-auto rounded-xl" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImage('');
                      setCurrentStep(0);
                    }}
                  >
                    {t('upload.remove')}
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className="w-14 h-14 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">{t('upload.clickUpload')}</p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          <div>
            <Label className="text-base mb-3 block">{t('upload.description')}</Label>
            <div className="relative">
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('upload.placeholder')}
                className="min-h-28 text-base pr-14 bg-input/30"
              />
              <Button
                type="button"
                size="icon"
                className={cn(
                  'absolute bottom-3 right-3 rounded-full',
                  isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-brand-primary hover:bg-brand-primary/90'
                )}
                onClick={startVoiceInput}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">{t('upload.voiceHint')}</p>
          </div>

          <Button
            onClick={generateAIData}
            disabled={isGenerating || !description.trim()}
            className="w-full h-12 bg-gradient-to-r from-brand-primary to-emerald-500 text-base"
          >
            <Sparkles className="w-5 h-5" />
            {isGenerating ? t('upload.generating') : t('upload.generate')}
          </Button>

          <AnimatePresence>
            {isGenerating && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 rounded-xl bg-muted animate-pulse" />
                ))}
              </motion.div>
            )}

            {aiResult && !isGenerating && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5 border-t border-border pt-6"
              >
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-brand-accent" />
                  {t('upload.results')}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-green-950/30 border-green-800/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Tag className="w-4 h-4 text-green-400" />
                        {t('upload.titleLabel')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Input
                        value={aiResult.title}
                        onChange={(e) => updateAiField('title', e.target.value)}
                        className="bg-background/50"
                      />
                    </CardContent>
                  </Card>

                  <Card className="bg-amber-950/30 border-amber-800/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-amber-400" />
                        {t('upload.priceLabel')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Input
                        type="number"
                        value={aiResult.price}
                        onChange={(e) => updateAiField('price', Number(e.target.value))}
                        className="bg-background/50 text-lg font-bold"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {t('upload.priceRange', { range: aiResult.pricing.range })}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-blue-950/30 border-blue-800/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{t('upload.ecommerceDesc')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={aiResult.ecommerceDescription}
                      onChange={(e) => updateAiField('ecommerceDescription', e.target.value)}
                      className="bg-background/50 min-h-24"
                    />
                  </CardContent>
                </Card>

                <Card className="bg-purple-950/30 border-purple-800/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Instagram className="w-4 h-4 text-purple-400" />
                      {t('upload.instagramCaption')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Textarea
                      value={aiResult.caption}
                      onChange={(e) => updateAiField('caption', e.target.value)}
                      className="bg-background/50"
                    />
                    <Input
                      value={aiResult.hashtags.join(' ')}
                      onChange={(e) =>
                        updateAiField(
                          'hashtags',
                          e.target.value.split(/\s+/).filter(Boolean)
                        )
                      }
                      placeholder="#Handmade #Artisan"
                      className="bg-background/50 text-sm"
                    />
                  </CardContent>
                </Card>

                <Card className="bg-teal-950/30 border-teal-800/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{t('upload.fairPricing')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('upload.labor')}</span>
                      <span>₹{aiResult.pricing.labor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('upload.material')}</span>
                      <span>₹{aiResult.pricing.material}</span>
                    </div>
                    <div className="flex justify-between border-t border-border pt-2 font-semibold">
                      <span>{t('upload.suggested')}</span>
                      <span className="text-brand-primary">₹{aiResult.price}</span>
                    </div>
                  </CardContent>
                </Card>

                <Button
                  onClick={handlePublish}
                  className="w-full h-12 bg-gradient-to-r from-brand-primary to-emerald-600 text-base font-bold"
                >
                  {t('upload.publish')}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
