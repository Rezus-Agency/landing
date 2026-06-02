"use client";

import { useState, FormEvent } from "react";
import { ArrowRightIcon } from "@/components/icons";
import { track } from "@/lib/analytics";

type FieldErrors = {
  name?: boolean;
  email?: boolean;
  message?: boolean;
};

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const ERROR_MESSAGES = {
  name: "Indiquez votre nom.",
  email: "Indiquez un email professionnel valide.",
  message: "Décrivez brièvement votre situation.",
} as const;

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

    track("Contact form submitted", {
      hasCompany: Boolean(fd.get("company")?.toString().trim()),
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="form__ok show" role="status" aria-live="polite">
        <h3>Message envoyé.</h3>
        <p>On revient vers vous sous 24 h ouvrées avec des créneaux.</p>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate aria-label="Formulaire de contact">
      <div className="field">
        <label htmlFor="cf-name">Nom</label>
        <input
          type="text"
          id="cf-name"
          name="name"
          placeholder="Prénom Nom"
          required
          aria-invalid={errors.name || undefined}
          aria-describedby={errors.name ? "cf-name-err" : undefined}
          autoComplete="name"
          style={errors.name ? { borderColor: "oklch(0.7 0.13 25)" } : undefined}
        />
        {errors.name && (
          <p id="cf-name-err" className="field__err" role="alert">
            {ERROR_MESSAGES.name}
          </p>
        )}
      </div>
      <div className="field">
        <label htmlFor="cf-email">Email professionnel</label>
        <input
          type="email"
          id="cf-email"
          name="email"
          placeholder="vous@entreprise.com"
          required
          aria-invalid={errors.email || undefined}
          aria-describedby={errors.email ? "cf-email-err" : undefined}
          autoComplete="email"
          inputMode="email"
          style={errors.email ? { borderColor: "oklch(0.7 0.13 25)" } : undefined}
        />
        {errors.email && (
          <p id="cf-email-err" className="field__err" role="alert">
            {ERROR_MESSAGES.email}
          </p>
        )}
      </div>
      <div className="field">
        <label htmlFor="cf-company">
          Entreprise <span className="opt">(optionnel)</span>
        </label>
        <input
          type="text"
          id="cf-company"
          name="company"
          placeholder="entreprise.com"
          autoComplete="organization"
        />
      </div>
      <div className="field">
        <label htmlFor="cf-msg">Votre situation</label>
        <textarea
          id="cf-msg"
          name="message"
          placeholder="Ce que vous vendez, à qui aujourd'hui, et ce que vous attendez d'un outbound qui marche."
          required
          aria-invalid={errors.message || undefined}
          aria-describedby={errors.message ? "cf-msg-err" : undefined}
          style={errors.message ? { borderColor: "oklch(0.7 0.13 25)" } : undefined}
        />
        {errors.message && (
          <p id="cf-msg-err" className="field__err" role="alert">
            {ERROR_MESSAGES.message}
          </p>
        )}
      </div>
      <button className="btn btn--primary" type="submit">
        Envoyer le message
        <ArrowRightIcon />
      </button>
      <p className="form__fine">Réponse sous 24 h ouvrées.</p>
    </form>
  );
}
