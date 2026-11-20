"use client";
import { useSyncExternalStore, useState } from "react";
import type { FormEvent } from "react";
import { profile } from "@/data/portfolio";
import type { Locale } from "@/lib/routes";
import { composeMailto } from "@/lib/contact";
import { Icon } from "./icon";
import { SectionHeading } from "./section-heading";
export function ContactPage({ locale }: { locale: Locale }) {
  const vi = locale === "vi";
  const [draft, setDraft] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [prepared, setPrepared] = useState("");
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const uri = composeMailto(draft);
    setPrepared(uri);
    window.location.href = uri;
  };
  const contacts = [
    {
      icon: "github",
      label: "GitHub",
      value: "github.com/r00tK1ngX",
      href: profile.github,
    },
    {
      icon: "linkedin",
      label: "LinkedIn",
      value: "Châu Anh Dũng",
      href: profile.linkedIn,
    },
    {
      icon: "mail",
      label: "Email",
      value: profile.email,
      href: `mailto:${profile.email}`,
    },
    {
      icon: "location",
      label: vi ? "Địa điểm" : "Location",
      value: profile.location[locale],
      href: undefined,
    },
  ];
  return (
    <section className="page-section">
      <div className="container">
        <SectionHeading
          eyebrow={vi ? "Kết nối" : "Get in touch"}
          title={vi ? "Cùng" : "Let’s"}
          accent={vi ? "Kết nối" : "Connect"}
          description={
            vi
              ? "Kết nối về cơ hội thực tập, học tập và các dự án an ninh mạng."
              : "Let’s talk about internship opportunities, learning and cybersecurity projects."
          }
        />
        <div className="contact-grid">
          <div>
            <h2 className="contact-heading">
              {vi ? "Mở ra cuộc" : "Start a"}{" "}
              <span className="accent">
                {vi ? "Trò chuyện" : "Conversation"}
              </span>
            </h2>
            <p className="contact-intro">{profile.objective[locale]}</p>
            <p className="availability" style={{ marginBottom: 24 }}>
              <i />
              {vi
                ? "Tìm kiếm cơ hội thực tập"
                : "Open to internship opportunities"}
            </p>
            <div className="contact-list">
              {contacts.map((contact) => {
                const body = (
                  <>
                    <div className="icon-box">
                      <Icon name={contact.icon} />
                    </div>
                    <div>
                      <b>{contact.label}</b>
                      <span>{contact.value}</span>
                    </div>
                    {contact.href?.startsWith("https") && (
                      <Icon name="arrow" size={15} />
                    )}
                  </>
                );
                return contact.href ? (
                  <a
                    className="panel contact-card"
                    key={contact.label}
                    href={contact.href}
                    target={
                      contact.href.startsWith("https") ? "_blank" : undefined
                    }
                    rel={
                      contact.href.startsWith("https")
                        ? "noopener noreferrer"
                        : undefined
                    }
                  >
                    {body}
                  </a>
                ) : (
                  <div className="panel contact-card" key={contact.label}>
                    {body}
                  </div>
                );
              })}
            </div>
          </div>
          <form className="panel contact-form" onSubmit={submit}>
            <h2>
              {vi ? "Soạn" : "Compose a"}{" "}
              <span className="accent">{vi ? "Email" : "Message"}</span>
            </h2>
            <p>
              {vi
                ? "Biểu mẫu này mở ứng dụng email của bạn. Website không lưu nội dung hoặc gửi thư qua máy chủ."
                : "This form opens your email app. The website does not store your message or send mail through a server."}
            </p>
            <div className="field-row">
              {(["name", "email"] as const).map((key) => (
                <div className="field" key={key}>
                  <label htmlFor={`contact-${key}`}>
                    {key === "name"
                      ? vi
                        ? "Tên của bạn"
                        : "Your name"
                      : "Email"}{" "}
                    *
                  </label>
                  <input
                    id={`contact-${key}`}
                    name={key}
                    type={key === "email" ? "email" : "text"}
                    autoComplete={key === "email" ? "email" : "name"}
                    required
                    maxLength={key === "email" ? 254 : 100}
                    value={draft[key]}
                    onChange={(e) =>
                      setDraft({ ...draft, [key]: e.target.value })
                    }
                    placeholder={
                      key === "email"
                        ? "you@example.com"
                        : vi
                          ? "Tên của bạn"
                          : "Your name"
                    }
                  />
                </div>
              ))}
            </div>
            <div className="field">
              <label htmlFor="contact-subject">
                {vi ? "Tiêu đề" : "Subject"} *
              </label>
              <input
                id="contact-subject"
                name="subject"
                required
                maxLength={180}
                value={draft.subject}
                onChange={(e) =>
                  setDraft({ ...draft, subject: e.target.value })
                }
                placeholder={
                  vi
                    ? "Bạn muốn trao đổi điều gì?"
                    : "What would you like to discuss?"
                }
              />
            </div>
            <div className="field">
              <label htmlFor="contact-message">
                {vi ? "Nội dung" : "Message"} *
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                maxLength={2000}
                value={draft.message}
                onChange={(e) =>
                  setDraft({ ...draft, message: e.target.value })
                }
                placeholder={vi ? "Nội dung email của bạn…" : "Your message…"}
                rows={5}
              />
            </div>
            <button className="button" type="submit" disabled={!hydrated}>
              <Icon name="mail" size={16} />
              {vi ? "Mở ứng dụng email" : "Open email app"}
            </button>
            <p className="mailto-note" role="status">
              {prepared
                ? vi
                  ? "Đã chuẩn bị bản nháp. Hoàn tất gửi trong ứng dụng email của bạn."
                  : "Draft prepared. Complete sending in your email app."
                : vi
                  ? "Bạn cũng có thể gửi email trực tiếp:"
                  : "You can also email me directly:"}{" "}
              <a
                className="accent"
                href={prepared || `mailto:${profile.email}`}
              >
                {prepared
                  ? vi
                    ? "Mở lại bản nháp"
                    : "Open draft again"
                  : profile.email}
              </a>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
