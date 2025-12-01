// src/pages/Login1.jsx
import React, { useState, useRef, useEffect, useId } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../Style/Login.css';
import { auth, signInWithEmailAndPassword } from '../firebaseClient';
import { useAuth } from '../context/AuthContext';

// 🔧 Normalisation de l’URL API (enlève les / de fin et un éventuel /api)
const normalizeApi = (url) => {
  const fallback = 'http://localhost:5000';
  if (!url) return fallback;

  let clean = url.trim();

  // enlève les / à la fin
  clean = clean.replace(/\/+$/, '');

  // si ça se termine par /api ou /api/ → on enlève /api
  if (clean.toLowerCase().endsWith('/api')) {
    clean = clean.slice(0, -4);
  }

  return clean || fallback;
};

const API = normalizeApi(process.env.REACT_APP_API_URL);
const SHOW_RECAPTCHA = process.env.NODE_ENV !== 'test';

// util timeout
const fetchWithTimeout = async (url, options = {}, ms = 10000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
};

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { refreshMe } = useAuth();

  // IDs stables & accessibles
  const emailId = useId();
  const pwdId = useId();
  const emailErrId = `${emailId}-err`;
  const pwdErrId = `${pwdId}-err`;

  // Gestion du focus
  const errorSummaryRef = useRef(null);
  const emailRef = useRef(null);
  const pwdRef = useRef(null);

  // reCAPTCHA
  const recaptchaRef = useRef(null);
  const widgetIdRef = useRef(null);
  const renderedRef = useRef(false);

  // Titre de page explicite
  useEffect(() => {
    document.title = 'Connexion — Gourmet Delight';
  }, []);

  /* -------- reCAPTCHA : charger le script + rendre le widget (sans doublon) -------- */
  useEffect(() => {
    if (!SHOW_RECAPTCHA) return;

    const renderWidget = () => {
      if (renderedRef.current) return;
      if (!window.grecaptcha || typeof window.grecaptcha.render !== 'function') return;
      if (!recaptchaRef.current) return;

      widgetIdRef.current = window.grecaptcha.render(recaptchaRef.current, {
        sitekey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI', // clé TEST v2
        theme: 'light',
        size: 'normal',
        hl: 'fr',
      });
      renderedRef.current = true;
    };

    if (window.grecaptcha && typeof window.grecaptcha.render === 'function') {
      renderWidget();
      return;
    }

    if (!document.querySelector('#recaptcha-script')) {
      const s = document.createElement('script');
      s.id = 'recaptcha-script';
      s.src = 'https://www.google.com/recaptcha/api.js?render=explicit&hl=fr';
      s.async = true;
      s.defer = true;
      s.onload = renderWidget;
      document.body.appendChild(s);
    }

    const t = setInterval(() => {
      if (window.grecaptcha && typeof window.grecaptcha.render === 'function') {
        clearInterval(t);
        renderWidget();
      }
    }, 200);

    return () => clearInterval(t);
  }, []);

  // validation
  const validate = () => {
    const errs = {};
    if (!form.email.trim()) {
      errs.email = 'L’email est requis.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errs.email = "Format d’email invalide.";
    }

    if (!form.password?.trim()) {
      errs.password = 'Le mot de passe est requis.';
    } else if (form.password.length < 12) {
      errs.password = 'Minimum 12 caractères.';
    }

    return errs;
  };

  // focus sur premier champ en erreur
  const focusFirstError = (errs) => {
    if (errs.email && emailRef.current) {
      emailRef.current.focus();
      return;
    }
    if (errs.password && pwdRef.current) {
      pwdRef.current.focus();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: '' }));
    setApiError('');
  };

  const firebaseLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
    } catch {
      // on ignore les erreurs Firebase ici
    }
  };

  const getCsrfToken = async () => {
    const res = await fetchWithTimeout(
      `${API}/api/csrf-token`,
      { credentials: 'include' },
      8000
    );

    if (!res.ok) throw new Error(`CSRF ${res.status}`);
    const data = await res.json();
    if (!data?.csrfToken) throw new Error('No CSRF token returned');
    return data.csrfToken;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      // annonce & focus récap
      requestAnimationFrame(() => {
        errorSummaryRef.current?.focus();
        focusFirstError(errs);
      });
      return;
    }

    // reCAPTCHA
    let recaptchaToken = 'dev';
    if (SHOW_RECAPTCHA) {
      const id = widgetIdRef.current;
      if (!window.grecaptcha || id == null) {
        setApiError('reCAPTCHA non chargé.');
        return;
      }
      recaptchaToken = window.grecaptcha.getResponse(id);
      if (!recaptchaToken) {
        setApiError('Veuillez cocher le reCAPTCHA.');
        return;
      }
    }

    try {
      setSubmitting(true);
      const csrfToken = await getCsrfToken();

      const res = await fetchWithTimeout(
        `${API}/api/auth/login`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken,
          },
          body: JSON.stringify({
            email: form.email,
            password: form.password,
            mot_de_passe: form.password, // compat
            recaptchaToken,
          }),
        },
        12000
      );

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }

      if (!res.ok) {
        setApiError(data?.message || `Erreur ${res.status} au login`);
        return;
      }

      // met à jour le contexte utilisateur
      await refreshMe().catch(() => {});
      firebaseLogin().catch(() => {});

      // on garde les infos utiles
      if (data?.user) {
        localStorage.setItem('role', data.user.role || '');
        localStorage.setItem('prenom', data.user.prenom || '');
      }

      // ✅ si le backend renvoie un JWT, on le stocke
      if (data?.token) {
        localStorage.setItem('token', data.token);
      } else {
        // par sécurité, on enlève tout ancien token
        localStorage.removeItem('token');
      }

      const from = location.state?.from?.pathname;
      const target =
        from || (data?.user?.role === 'admin' ? '/admin/dashboard' : '/employe/dashboard');

      try {
        navigate(target, { replace: true });
      } catch {
        // fallback hard reload
        window.location.assign(target);
      }

      setTimeout(() => {
        if (window.location.pathname !== target) {
          window.location.assign(target);
        }
      }, 60);
    } catch (error) {
      setApiError(
        error.name === 'AbortError'
          ? 'La requête a expiré. Réessayez.'
          : 'Erreur réseau.'
      );
    } finally {
      setSubmitting(false);
      if (SHOW_RECAPTCHA && window.grecaptcha && widgetIdRef.current != null) {
        window.grecaptcha.reset(widgetIdRef.current);
      }
    }
  };

  const hasErrors = Boolean(errors.email || errors.password);

  return (
    <main className="login-container" aria-label="Page de connexion">
      {/* Récapitulatif d’erreurs (annoncé aux lecteurs d’écran) */}
      <div
        ref={errorSummaryRef}
        tabIndex={hasErrors ? -1 : undefined}
        aria-live="assertive"
        aria-atomic="true"
        className="visually-hidden"
      >
        {hasErrors && (
          <>
            Le formulaire contient des erreurs.
            {errors.email ? ` Erreur email : ${errors.email}.` : ''}
            {errors.password ? ` Erreur mot de passe : ${errors.password}.` : ''}
          </>
        )}
      </div>

      <form
        id="login-form"
        className="login-form"
        onSubmit={handleSubmit}
        noValidate
        aria-describedby={apiError ? 'api-error' : undefined}
        aria-busy={submitting}
      >
        <h1>Connexion</h1>

        {/* Erreur API (annoncée aux lecteurs d’écran) */}
        {apiError && (
          <p id="api-error" className="error" role="alert" aria-live="assertive">
            {apiError}
          </p>
        )}

        <label htmlFor={emailId}>Email</label>
        <input
          ref={emailRef}
          type="email"
          id={emailId}
          name="email"
          value={form.email}
          onChange={handleChange}
          inputMode="email"
          autoCapitalize="none"
          autoCorrect="off"
          aria-describedby={errors.email ? emailErrId : undefined}
          aria-invalid={!!errors.email}
          placeholder="exemple@delight.com"
          required
          autoComplete="email"
        />
        {errors.email && (
          <span id={emailErrId} className="error">
            {errors.email}
          </span>
        )}

        <label htmlFor={pwdId}>Mot de passe</label>
        <input
          ref={pwdRef}
          type="password"
          id={pwdId}
          name="password"
          value={form.password}
          onChange={handleChange}
          aria-describedby={errors.password ? pwdErrId : undefined}
          aria-invalid={!!errors.password}
          placeholder="••••••••••••"
          required
          autoComplete="current-password"
        />
        {errors.password && (
          <span id={pwdErrId} className="error">
            {errors.password}
          </span>
        )}

        {/* reCAPTCHA v2 */}
        {SHOW_RECAPTCHA && (
          <div
            ref={recaptchaRef}
            id="recaptcha-container"
            role="group"
            aria-label="Vérification reCAPTCHA — cochez la case Je ne suis pas un robot"
            style={{ minHeight: 78 }}
          />
        )}

        <button
          type="submit"
          disabled={submitting}
          aria-describedby={submitting ? 'submit-status' : undefined}
        >
          {submitting ? 'Connexion…' : 'Se connecter'}
        </button>

        <p
          id="submit-status"
          role="status"
          aria-live="polite"
          className="visually-hidden"
        />
      </form>
    </main>
  );
};

export default Login;

