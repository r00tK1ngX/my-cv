import type { ResearchRecord } from "@/data/portfolio";
import type { Locale } from "@/lib/routes";
import { Icon } from "./icon";
export function ResearchCard({
  item,
  locale,
}: {
  item: ResearchRecord;
  locale: Locale;
}) {
  const vi = locale === "vi";
  const accent =
    item.category === "cves"
      ? "red"
      : item.category === "exploits"
        ? "green"
        : "amber";
  const icon =
    item.category === "cves"
      ? "shield"
      : item.category === "exploits"
        ? "file"
        : "research";
  return (
    <article className={`panel research-card ${accent}`}>
      <div className="research-card-body">
        <div className="research-card-top">
          <div className="research-card-identity">
            <div className="icon-box">
              <Icon name={icon} />
            </div>
            <div>
              <h2>{item.identifier ?? item.title[locale]}</h2>
              {(item.vendor || item.platform) && (
                <p className="research-card-meta">
                  {item.vendor ?? item.platform}
                </p>
              )}
            </div>
          </div>
          <div className="research-card-status">
            {item.severity && <span className="tag">{item.severity}</span>}
            {item.status && <span>{item.status}</span>}
            {item.verified === true && (
              <span className="tag">
                <Icon name="check" size={12} />
                {vi ? "Đã xác minh" : "Verified"}
              </span>
            )}
          </div>
        </div>
        {item.category === "cves" && item.score !== undefined && (
          <div className="research-score">
            <span>CVSS Score</span>
            <strong>{item.score}</strong>
          </div>
        )}
        {item.category === "bounties" && item.reward && (
          <div className="research-score">
            <span>{vi ? "Tiền thưởng" : "Bounty"}</span>
            <strong>{item.reward}</strong>
          </div>
        )}
        {item.identifier && <h3>{item.title[locale]}</h3>}
        <p className="research-description">{item.description[locale]}</p>
        {item.details && (
          <ul>
            {item.details.map((detail, i) => (
              <li key={i}>
                <span>▸</span>
                {detail[locale]}
              </li>
            ))}
          </ul>
        )}
        <time className="research-card-meta" dateTime={item.date}>
          {item.date}
        </time>
      </div>
      <div className="research-card-link">
        <a href={item.href} target="_blank" rel="noopener noreferrer">
          <Icon name="external" size={14} />
          {item.category === "cves"
            ? vi
              ? "Xem chi tiết CVE"
              : "View CVE details"
            : item.category === "exploits"
              ? vi
                ? "Xem bản công bố"
                : "View exploit record"
              : vi
                ? "Xem báo cáo"
                : "View disclosure"}
        </a>
      </div>
    </article>
  );
}
