import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ArrowLeft, Wand2 } from 'lucide-react';
import { BrandBrief } from '../types';
import { PREDEFINED_PALETTES, INDUSTRIES, STYLE_DIRECTIONS, USE_CASES } from '../constants';

const briefSchema = z.object({
  businessName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  description: z.string().min(10, 'Describe tu negocio con un poco más de detalle'),
  industry: z.string().optional(),
  audienceType: z.enum(['B2B', 'B2C', 'Both']),
  audienceTags: z.string().min(2, 'Ej: Startups, Jóvenes, Profesionales'),
  values: z.string().optional(),
  competitors: z.string().optional(),
  messagingHints: z.string().optional(),
  inspirationUrls: z.string().optional(),
  styleClassicModern: z.number().min(0).max(100),
  styleAccessiblePremium: z.number().min(0).max(100),
  styleFunSerious: z.number().min(0).max(100),
  styleDirections: z.array(z.string()).optional(),
  preferredUseCases: z.array(z.string()).optional(),
  colorPalette: z.string().optional(),
  customColors: z.string().optional(),
});

interface WizardProps {
  onSubmit: (data: BrandBrief) => void;
  initialData?: Partial<BrandBrief>;
}

export default function Wizard({ onSubmit, initialData }: WizardProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  const { register, handleSubmit, formState: { errors }, trigger, watch, setValue } = useForm<BrandBrief>({
    resolver: zodResolver(briefSchema),
    defaultValues: {
      businessName: '',
      description: '',
      industry: '',
      audienceType: 'B2C',
      audienceTags: '',
      values: '',
      competitors: '',
      messagingHints: '',
      inspirationUrls: '',
      styleClassicModern: 50,
      styleAccessiblePremium: 50,
      styleFunSerious: 50,
      styleDirections: [],
      preferredUseCases: [],
      colorPalette: '',
      customColors: '',
      ...initialData // Override with saved data if available
    }
  });

  const nextStep = async () => {
    let fieldsToValidate: any[] = [];
    if (step === 1) fieldsToValidate = ['businessName', 'description'];
    if (step === 2) fieldsToValidate = ['audienceType', 'audienceTags'];
    // Step 3 (Sliders) and Step 4 (Colors) don't strictly need validation as they have defaults/optional
    
    const isStepValid = await trigger(fieldsToValidate as any);
    if (isStepValid) {
      setStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="max-w-2xl mx-auto w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden text-left">
      <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-display font-bold text-gray-900">Brand Brief</h2>
          <span className="text-sm font-medium text-gray-500">Paso {step} de {totalSteps}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className="bg-black h-1.5 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="p-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-semibold mb-1">1. Tu Negocio</h3>
                  <p className="text-sm text-gray-500 mb-4">Cuéntanos sobre tu empresa o proyecto.</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la marca</label>
                  <input 
                    {...register('businessName')}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black"
                    placeholder="Ej: Acme Corp"
                  />
                  {errors.businessName && <p className="text-red-500 text-xs mt-1">{errors.businessName.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">¿Qué hace tu negocio?</label>
                  <textarea 
                    {...register('description')}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all resize-none text-black"
                    placeholder="Desarrollamos software para..."
                  />
                  {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Industria <span className="text-gray-400 font-normal">(Opcional)</span></label>
                  <select 
                    {...register('industry')}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all bg-white text-black"
                  >
                    <option value="" className="text-black">Selecciona una industria</option>
                    {INDUSTRIES.map(ind => (
                      <option key={ind} value={ind} className="text-black">{ind}</option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-semibold mb-1">2. Tu Audiencia y Contexto</h3>
                  <p className="text-sm text-gray-500 mb-4">Profundiza en a quién le hablamos de forma opcional.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de cliente</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['B2B', 'B2C', 'Both'].map((type) => (
                      <label 
                        key={type} 
                        className={`
                          cursor-pointer border rounded-lg p-3 text-center transition-all
                          ${watch('audienceType') === type ? 'border-black bg-gray-50 ring-1 ring-black' : 'border-gray-200 hover:border-gray-300'}
                        `}
                      >
                        <input 
                          type="radio" 
                          value={type} 
                          {...register('audienceType')} 
                          className="sr-only" 
                        />
                        <span className="text-sm font-medium">{type === 'Both' ? 'Ambos' : type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Palabras clave de tu audiencia</label>
                  <input 
                    {...register('audienceTags')}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black"
                    placeholder="Ej: Startups, Millennials, Deportistas"
                  />
                  {errors.audienceTags && <p className="text-red-500 text-xs mt-1">{errors.audienceTags.message}</p>}
                </div>

                <details className="group border border-gray-200 rounded-lg bg-gray-50/50">
                  <summary className="cursor-pointer px-4 py-3 font-medium text-sm text-gray-700 flex justify-between items-center list-none [&::-webkit-details-marker]:hidden">
                    Información adicional (Opcional)
                    <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="p-4 border-t border-gray-200 space-y-4 bg-white rounded-b-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Valores de marca</label>
                      <input 
                        {...register('values')}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm text-black"
                        placeholder="Ej: Transparencia, Innovación, Sostenibilidad"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Competidores o referencias</label>
                      <input 
                        {...register('competitors')}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm text-black"
                        placeholder="Ej: Nos gusta Nike, competimos con Adidas"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Inspiración (URLs)</label>
                      <input 
                        {...register('inspirationUrls')}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm text-black"
                        placeholder="Ej: https://stripe.com, https://linear.app"
                      />
                    </div>
                  </div>
                </details>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div>
                  <h3 className="text-lg font-semibold mb-1">3. Personalidad y Estilo</h3>
                  <p className="text-sm text-gray-500 mb-4">Define el "vibe" y la dirección visual.</p>
                </div>

                <div className="space-y-6">
                  <SliderField 
                    labelLeft="Clásico" 
                    labelRight="Moderno" 
                    value={watch('styleClassicModern')} 
                    onChange={(val) => setValue('styleClassicModern', val)} 
                  />
                  <SliderField 
                    labelLeft="Accesible" 
                    labelRight="Premium" 
                    value={watch('styleAccessiblePremium')} 
                    onChange={(val) => setValue('styleAccessiblePremium', val)} 
                  />
                  <SliderField 
                    labelLeft="Divertido" 
                    labelRight="Serio" 
                    value={watch('styleFunSerious')} 
                    onChange={(val) => setValue('styleFunSerious', val)} 
                  />
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Direcciones de Estilo <span className="text-gray-400 font-normal">(Opcional)</span></label>
                  <div className="flex flex-wrap gap-2">
                    {STYLE_DIRECTIONS.map((dir) => {
                      const selected = watch('styleDirections')?.includes(dir.id);
                      return (
                        <button
                          key={dir.id}
                          type="button"
                          onClick={() => {
                            const current = watch('styleDirections') || [];
                            setValue('styleDirections', selected 
                              ? current.filter(id => id !== dir.id)
                              : [...current, dir.id]
                            );
                          }}
                          className={`
                            px-3 py-1.5 rounded-full text-xs font-medium transition-all border
                            ${selected ? 'bg-black text-white border-black shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}
                          `}
                        >
                          {dir.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div>
                  <h3 className="text-lg font-semibold mb-1">4. Sistema de Color</h3>
                  <p className="text-sm text-gray-500 mb-4">Elige los colores core de tu identidad.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Gamas Curadas</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    {PREDEFINED_PALETTES.map((palette) => (
                      <div 
                        key={palette.id}
                        onClick={() => setValue('colorPalette', palette.id)}
                        className={`
                          cursor-pointer border rounded-lg p-3 flex items-center justify-between transition-all
                          ${watch('colorPalette') === palette.id ? 'border-black bg-gray-50 ring-1 ring-black shadow-sm' : 'border-gray-200 hover:border-gray-300'}
                        `}
                      >
                        <span className="text-sm font-medium text-gray-700">{palette.name}</span>
                        <div className="flex -space-x-1">
                          {palette.colors.map((color, i) => (
                            <div 
                              key={i} 
                              className="w-5 h-5 rounded-full border border-white shadow-sm" 
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-6 border-t border-gray-100">
                    <label className="block text-sm font-medium text-gray-700 mb-1">¿Tienes colores específicos? <span className="text-gray-400 font-normal">(Opcional)</span></label>
                    <p className="text-xs text-gray-500 mb-2">Ingresa tus códigos HEX separados por coma.</p>
                    <input 
                      {...register('customColors')}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all font-mono text-sm text-black"
                      placeholder="Ej: #FF5733, #33FF57"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div>
                  <h3 className="text-lg font-semibold mb-1">5. Entregables</h3>
                  <p className="text-sm text-gray-500 mb-4">¿Dónde planeas usar tu marca principalmente?</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Casos de Uso <span className="text-gray-400 font-normal">(Selecciona varios)</span></label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {USE_CASES.map((useCase) => {
                      const selected = watch('preferredUseCases')?.includes(useCase.id);
                      return (
                        <div
                          key={useCase.id}
                          onClick={() => {
                            const current = watch('preferredUseCases') || [];
                            setValue('preferredUseCases', selected 
                              ? current.filter(id => id !== useCase.id)
                              : [...current, useCase.id]
                            );
                          }}
                          className={`
                            cursor-pointer border rounded-lg p-3 text-center transition-all text-sm
                            ${selected ? 'border-black bg-gray-50 ring-1 ring-black shadow-sm font-medium text-black' : 'border-gray-200 hover:border-gray-300 text-gray-600'}
                          `}
                        >
                          {useCase.label}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-black transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Atrás
              </button>
            ) : <div></div>}

            {step < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center px-6 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                Siguiente
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            ) : (
              <button
                type="submit"
                className="flex items-center px-6 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-md"
              >
                <Wand2 className="w-4 h-4 mr-2" />
                Generar Magia
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

function SliderField({ labelLeft, labelRight, value, onChange }: { labelLeft: string, labelRight: string, value: number, onChange: (val: number) => void }) {
  return (
    <div>
      <div className="flex justify-between text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">
        <span>{labelLeft}</span>
        <span>{labelRight}</span>
      </div>
      <input 
        type="range" 
        min="0" 
        max="100" 
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
      />
    </div>
  );
}
