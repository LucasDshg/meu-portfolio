import { signInWithPopup } from "firebase/auth";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import logoIcon from "../assets/logo.svg";
import { auth, googleProvider } from "../data/firebase";
import { Button } from "../Lib/Button";
import { Card } from "../Lib/Card";
import { Heading } from "../Lib/Heading";
import { Text } from "../Lib/Text";

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Card variant="primary" className="text-center">
          <div className="flex justify-center mb-6">
            <img src={logoIcon} alt="Logo" className="h-30 w-30" />
          </div>
          <Heading className="text-3xl mb-2">Crie seu Portfólio</Heading>
          <Text className="mb-8">
            Crie sua conta e tenha um portfólio profissional personalizado,
            pronto para ser compartilhado em suas redes sociais e destacar sua
            trajetória para o mundo.
          </Text>

          <Button
            onClick={handleGoogleLogin}
            variant="outline"
            className="w-full py-3 flex gap-3 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
          >
            <FcGoogle size={24} />
            Entrar com Google
          </Button>

          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            className="mt-8 w-full gap-2"
          >
            Voltar para a página anterior
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Login;
