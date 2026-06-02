"use client";

import { useState, FormEvent } from "react";
import { ArrowRightIcon } from "@/components/icons";

type FieldErrors = {
  name?: boolean;
  email?: boolean;
  message?: boolean;
};

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function ContactForm() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const message = String(fd.get("message") || "").trim();

    const newErrors: FieldErrors = {
      name: !name,
      email: !email || !EMAIL_RE.test(email),
      message: !message,
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    // TODO: wire to Resend/Plunk in Phase 8 SEO + integrations
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="form__ok show" role="status" aria-live="polite">
        <h3>Demande envoyée.</h3>
        <p>Merci. On revient vers vous sous 24 h ouvrées avec des créneaux.</p>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <div className="field">
        <label htmlFor="cf-name">Nom</label>
        <input
          type="text"
          id="cf-name"
          name="name"
          placeholder="Prénom Nom"
          required
          style={errors.name ? { borderColor: "oklch(0.7 0.13 25)" } : undefined}
        />
      </div>
      <div className="field">
        <label htmlFor="cf-email">Email professionnel</label>
        <input
          type="email"
          id="cf-email"
          name="email"
          placeholder="vous@entreprise.com"
          required
          style={errors.email ? { borderColor: "oklch(0.7 0.13 25)" } : undefined}
        />
      </div>
      <div className="field">
        <label htmlFor="cf-company">
          Entreprise / site <span className="opt">(optionnel)</span>
        </label>
        <input type="text" id="cf-company" name="company" placeholder="entreprise.com" />
      </div>
      <div className="field">
        <label htmlFor="cf-msg">Votre contexte</label>
        <textarea
          id="cf-msg"
          name="message"
          placeholder="Ce que vous vendez, à qui, et ce que vous attendez de l'outbound."
          required
          style={errors.message ? { borderColor: "oklch(0.7 0.13 25)" } : undefined}
        />
      </div>
      <button className="btn btn--primary" type="submit">
        Envoyer la demande
        <ArrowRightIcon />
      </button>
      <p className="form__fine">Réponse sous 24 h ouvrées · Aucune donnée revendue</p>
    </form>
  );
}
