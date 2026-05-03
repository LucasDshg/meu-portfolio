import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { AnimatePresence } from 'framer-motion';
import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import logoIcon from '../assets/logo.svg';
import { auth, googleProvider } from '../data/firebase';
import { Button } from '../Lib/Button';
import { Card } from '../Lib/Card';
import { Heading } from '../Lib/Heading';
import { Image } from '../Lib/Image';
import { Input } from '../Lib/Input';
import { Text } from '../Lib/Text';
import { Toast } from '../Lib/Toast';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const handleGoogleLogin = async (): Promise<void> => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/admin');
    } catch (error) {
      setToast({ message: 'Erro ao fazer login com Google.', type: 'error' });
    }
  };

  const handleEmailAuth = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
        setToast({ message: 'Conta criada com sucesso!', type: 'success' });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/admin');
    } catch (error) {
      const message = isRegistering
        ? 'Erro ao criar conta. Verifique os dados.'
        : 'E-mail ou senha inválidos.';
      setToast({ message, type: 'error' });
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        <Card variant="primary" className="text-center">
          <div className="flex justify-center">
            <Image src={logoIcon} alt="Logo" className="h-30 w-33" />
          </div>
          <Heading className="text-3xl mb-2">
            {isRegistering ? 'Crie sua conta' : 'Acesse seu Portfólio'}
          </Heading>
          <Text className="mb-8">
            {isRegistering
              ? 'Comece agora a construir sua presença online profissional.'
              : 'Entre para gerenciar seus projetos e experiências.'}
          </Text>

          <form onSubmit={handleEmailAuth} className="space-y-4 mb-6 text-left">
            <Input
              label="E-mail"
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              required
              placeholder="seu@email.com"
            />
            <Input
              label="Senha"
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              required
              placeholder="••••••••"
            />
            <Button type="submit" className="w-full py-3 mt-2">
              {isRegistering ? 'Criar Conta' : 'Entrar'}
            </Button>
          </form>

          <div className="relative mb-6">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-zinc-200 dark:border-zinc-700"></div>
            </div>
            <div className="relative flex justify-center text-sm font-medium leading-6">
              <span className="px-4 text-zinc-400 ">Ou continue com</span>
            </div>
          </div>

          <Button
            onClick={handleGoogleLogin}
            variant="outline"
            className="w-full py-3 flex gap-3 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
          >
            <FcGoogle size={24} />
            Google
          </Button>

          <button
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
            className="mt-6 text-sm font-medium text-teal-600 hover:text-teal-500 cursor-pointer bg-transparent border-none"
          >
            {isRegistering
              ? 'Já tem uma conta? Faça login'
              : 'Não tem uma conta? Cadastre-se'}
          </button>

          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            className="mt-8 w-full gap-2"
          >
            Voltar para a página anterior
          </Button>
        </Card>
      </div>

      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;
