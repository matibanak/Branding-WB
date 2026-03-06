import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ArrowLeft, Wand2 } from 'lucide-react';
import { BrandBrief } from '../types';
import { PREDEFINED_PALETTES } from '../constants';

const briefSchema = z.object({
  businessName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  description: z.string().min(10, 'Describe tu negocio con un poco más de detalle'),
  audienceType: z.enum(['B2B', 'B2C', 'Both']),
  audienceTags: z.string().min(2, 'Ej: Startups, Jóvenes, Profesionales'),
  styleClassicModern: z.number().min(0).max(100),
  styleAccessiblePremium: z.number().min(0).max(100),
  styleFunSerious: z.number().min(0).max(100),
  colorPalette: z.string().optional(),
  customColors: z.string().optional(),
});

interface WizardProps {
  onSubmit: (data: BrandBrief) => void;
}

export default function Wizard({ onSubmit }: WizardProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const { register, handleSubmit, formState: { errors }, trigger, watch, setValue } = useForm<BrandBrief>({
    resolver: zodResolver(briefSchema),
    defaultValues: {
      businessName: '',
      description: '',
      audienceType: 'B2C',
      audienceTags: '',
      styleClassicModern: 50,
      styleAccessiblePremium: 50,
      styleFunSerious: 50,
      colorPalette: '',
      customColors: '',
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
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                    placeholder="Ej: Acme Corp"
                  />
                  {errors.businessName && <p className="text-red-500 text-xs mt-1">{errors.businessName.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">¿Qué hace tu negocio?</label>
                  <textarea 
                    {...register('description')}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Desarrollamos software para..."
                  />
                  {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
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
                  <h3 className="text-lg font-semibold mb-1">2. Tu Audiencia</h3>
                  <p className="text-sm text-gray-500 mb-4">¿A quién le estamos hablando?</p>
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
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                    placeholder="Ej: Startups, Millennials, Deportistas"
                  />
                  {errors.audienceTags && <p className="text-red-500 text-xs mt-1">{errors.audienceTags.message}</p>}
                </div>
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
                  <h3 className="text-lg font-semibold mb-1">3. Personalidad</h3>
                  <p className="text-sm text-gray-500 mb-4">Define el "vibe" de tu marca.</p>
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
                  <h3 className="text-lg font-semibold mb-1">4. Estilo Visual</h3>
                  <p className="text-sm text-gray-500 mb-4">Elige los colores que representarán a tu marca.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Gamas de colores preferidas</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    {PREDEFINED_PALETTES.map((palette) => (
                      <div 
                        key={palette.id}
                        onClick={() => setValue('colorPalette', palette.id)}
                        className={`
                          cursor-pointer border rounded-lg p-3 flex items-center justify-between transition-all
                          ${watch('colorPalette') === palette.id ? 'border-black bg-gray-50 ring-1 ring-black' : 'border-gray-200 hover:border-gray-300'}
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">¿Tienes colores específicos?</label>
                    <p className="text-xs text-gray-500 mb-2">Ingresa tus códigos HEX separados por coma.</p>
                    <input 
                      {...register('customColors')}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                      placeholder="Ej: #FF5733, #33FF57"
                    />
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
