import React, { useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { KeyRound, Mail, AlertCircle, Loader2 } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // 1. Gera ou recupera o ID único deste navegador específico
      let localDeviceId = localStorage.getItem("gigcash_device_id");
      if (!localDeviceId) {
        localDeviceId = "dev_" + Math.random().toString(36).substring(2) + Date.now().toString(36);
        localStorage.setItem("gigcash_device_id", localDeviceId);
      }

      // 2. Faz o login no Auth para obter o UID do usuário
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      // 3. Consulta o Firestore para checar se já existe sessão ativa
      const userDocRef = doc(db, "users_sessions", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        const activeDevice = data.activeDeviceId;

        // Se há um aparelho registrado e ele é DIFERENTE do ID deste navegador
        if (activeDevice && activeDevice !== localDeviceId) {
          await signOut(auth);
          setError("Acesso negado: Esta conta já está ativa em outro dispositivo. Encerre a sessão no outro aparelho para acessar aqui.");
          setLoading(false);
          return;
        }
      }

      // 4. Se não houver trava ou for o mesmo aparelho, define este como o ativo
      await setDoc(userDocRef, {
        email: user.email,
        activeDeviceId: localDeviceId,
        lastLogin: new Date().toISOString()
      }, { merge: true });

    } catch (err: any) {
      console.error("Erro ao autenticar:", err);
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
        setError("E-mail ou senha incorretos. Verifique suas credenciais.");
      } else if (err.code === "auth/invalid-email") {
        setError("O formato do e-mail inserido é inválido.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Muitas tentativas malsucedidas. Tente novamente mais tarde.");
      } else {
        setError(error || "Ocorreu um erro ao fazer login. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-violet-600/10 via-pink-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-pink-500/5 via-orange-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-pink-500 to-orange-500 rounded-3xl blur-xl opacity-30 animate-pulse pointer-events-none" />

        <div className="relative bg-[#0d1527]/90 border border-white/10 rounded-3xl p-8 space-y-8 shadow-2xl backdrop-blur-xl">
          <div className="text-center space-y-3">
            <div className="inline-flex relative mx-auto mb-2">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-pink-500 to-orange-500 rounded-2xl blur-md opacity-75 animate-pulse" />
              <div className="relative w-16 h-16 rounded-2xl bg-[#0a1122] border border-white/10 flex items-center justify-center font-sans overflow-hidden select-none">
                <span className="text-2xl font-black bg-gradient-to-r from-[#3B82F6] to-[#F97316] bg-clip-text text-transparent tracking-tighter pl-0.5">
                  GC
                </span>
                <span className="absolute bottom-1 right-1.5 text-xs animate-bounce" style={{ animationDuration: '3s' }}>
                  ⭐
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <h1 className="text-3xl font-black text-white tracking-tight">
                GIG<span className="gradient-text">CASH</span>
              </h1>
              <span className="inline-block text-[10px] font-extrabold bg-pink-500/20 text-pink-400 px-2.5 py-0.5 rounded-full border border-pink-500/30 uppercase tracking-widest">
                Sistema SaaS Fechado
              </span>
            </div>
            
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Cálculo automatizado de orçamentos, rateios de shows e propostas em PDF profissionais.
            </p>
          </div>

          <div className="p-4 bg-slate-950/65 rounded-2xl border border-white/5 space-y-2 text-left">
            <div className="text-xs font-bold text-violet-400 uppercase tracking-wider flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-violet-500" />
              Acesso Restrito
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Esta é uma plataforma privada. Não há opção de auto-cadastro na tela. O acesso é vendido externamente por convite.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2.5 text-xs text-red-400 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                E-mail de Assinante
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="exemplo@dominio.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/70 border border-white/15 focus:border-pink-500 rounded-xl text-sm focus:outline-none text-white transition-all placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Senha de Acesso
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                  <KeyRound className="w-4.5 h-4.5" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/70 border border-white/15 focus:border-pink-500 rounded-xl text-sm focus:outline-none text-white transition-all placeholder:text-slate-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-btn py-3.5 px-4 rounded-xl text-white font-bold text-sm transition-all cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(236,72,153,0.35)] flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Autenticando...</span>
                </>
              ) : (
                <span>Entrar no Painel</span>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <span className="text-[10px] text-slate-600 font-mono tracking-wider">
              GIGCASH Pro SaaS v2.0
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
