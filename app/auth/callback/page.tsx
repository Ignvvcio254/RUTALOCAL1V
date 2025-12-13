"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  const addDebugLog = (message: string) => {
    console.log(message);
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    const handleCallback = async () => {
      try {
        addDebugLog('🔄 [Callback] Iniciando proceso de callback...');
        addDebugLog(`📍 [Callback] URL actual: ${window.location.href}`);

        // Verificar si hay tokens en el hash (fallback de Supabase)
        const hash = window.location.hash;
        if (hash && hash.includes('access_token')) {
          addDebugLog('🔍 [Callback] Tokens detectados en hash URL');
          addDebugLog('💡 [Callback] Usando supabase.auth.getSession() para procesar...');
        }

        // Obtener la sesión de Supabase (procesa tokens del hash automáticamente)
        addDebugLog('📡 [Callback] Obteniendo sesión de Supabase...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          addDebugLog(`❌ [Callback] Error al obtener sesión: ${sessionError.message}`);
          throw sessionError;
        }

        if (!session) {
          addDebugLog('❌ [Callback] No se encontró sesión activa');
          addDebugLog('💡 [Callback] Esto puede ocurrir si el hash no tiene tokens válidos');
          throw new Error('No se recibió sesión de autenticación');
        }

        addDebugLog('✅ [Callback] Sesión obtenida correctamente');
        addDebugLog(`👤 [Callback] Usuario: ${session.user.email}`);
        addDebugLog(`🔑 [Callback] Access token recibido (primeros 20 chars): ${session.access_token.substring(0, 20)}...`);

        // Obtener datos del usuario de Supabase
        const userData = session.user;
        addDebugLog(`📋 [Callback] Datos del usuario:`);
        addDebugLog(`   - Email: ${userData.email}`);
        addDebugLog(`   - Provider: ${userData.app_metadata.provider}`);
        addDebugLog(`   - Full name: ${userData.user_metadata.full_name || 'N/A'}`);
        addDebugLog(`   - Avatar: ${userData.user_metadata.avatar_url || 'N/A'}`);

        // Enviar el token al backend para validación y sincronización
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        addDebugLog(`🌐 [Callback] Enviando token al backend: ${apiUrl}/api/auth/google`);

        const response = await fetch(`${apiUrl}/api/auth/google`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            access_token: session.access_token,
            refresh_token: session.refresh_token,
          }),
        });

        addDebugLog(`📨 [Callback] Respuesta del backend: ${response.status} ${response.statusText}`);

        if (!response.ok) {
          const errorData = await response.json();
          addDebugLog(`❌ [Callback] Error del backend: ${JSON.stringify(errorData)}`);
          throw new Error(errorData.message || 'Error en autenticación con el backend');
        }

        const data = await response.json();
        addDebugLog('✅ [Callback] Respuesta del backend exitosa');
        addDebugLog(`📦 [Callback] Datos recibidos: ${JSON.stringify(data, null, 2)}`);

        if (!data.success) {
          addDebugLog(`❌ [Callback] Backend indica fallo: ${data.message}`);
          throw new Error(data.message || 'Error en autenticación');
        }

        // Guardar tokens del backend en localStorage
        addDebugLog('💾 [Callback] Guardando tokens en localStorage...');
        localStorage.setItem('access_token', data.tokens.accessToken);
        localStorage.setItem('refresh_token', data.tokens.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        addDebugLog('✅ [Callback] Tokens guardados correctamente');

        // Redirigir según si es usuario nuevo o existente
        addDebugLog(`🎯 [Callback] Usuario ${data.isNewUser ? 'NUEVO' : 'EXISTENTE'}`);

        if (data.isNewUser) {
          addDebugLog('➡️ [Callback] Redirigiendo a onboarding...');
          router.push('/onboarding');
        } else {
          addDebugLog('➡️ [Callback] Redirigiendo a home...');
          window.location.href = '/';
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        addDebugLog(`❌ [Callback] ERROR CRÍTICO: ${errorMessage}`);
        console.error('Error completo:', error);
        setError(errorMessage);

        // Esperar 5 segundos para que el usuario vea el error
        setTimeout(() => {
          addDebugLog('➡️ [Callback] Redirigiendo a login...');
          router.push('/login?error=auth_failed');
        }, 5000);
      }
    };

    handleCallback();
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 p-4">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <span className="text-4xl">❌</span>
            </div>
            <h1 className="text-2xl font-bold text-red-600 mb-2">Error de Autenticación</h1>
            <p className="text-red-800">{error}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
            <h2 className="font-semibold text-sm text-gray-700 mb-2">📋 Debug Log:</h2>
            <div className="space-y-1 font-mono text-xs">
              {debugInfo.map((log, index) => (
                <div key={index} className="text-gray-600">
                  {log}
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-sm text-gray-600 mt-4">
            Redirigiendo al login en 5 segundos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <Loader2 className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Procesando autenticación</h1>
          <p className="text-gray-600">Por favor espera mientras validamos tu sesión...</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
          <h2 className="font-semibold text-sm text-gray-700 mb-2">📋 Debug Log:</h2>
          <div className="space-y-1 font-mono text-xs">
            {debugInfo.map((log, index) => (
              <div key={index} className="text-gray-600">
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
