import { signInWithPopup } from "firebase/auth";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { Button } from "../Lib/Button";
import { Card } from "../Lib/Card";
import { Heading } from "../Lib/Heading";
import { Text } from "../Lib/Text";
import { auth, googleProvider } from "../data/firebase";

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
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Card variant="outline" className="text-center">
          <div className="flex justify-center mb-6">
            <div className="h-12 w-12 rounded-xl bg-teal-500/10 flex items-center justify-center">
              <FcGoogle size={28} />
            </div>
          </div>
          <Heading className="text-3xl mb-2">Bem-vindo</Heading>
          <Text className="mb-8">
            Crie sua conta para começar a gerenciar seu portfólio profissional
            de forma dinâmica.
          </Text>

          <Button
            onClick={handleGoogleLogin}
            variant="primary"
            className="w-full py-3"
          >
            Entrar com Google
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Login;
