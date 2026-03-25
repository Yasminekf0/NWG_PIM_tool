"use client";

import { useState } from "react";
import { Product, AIContent } from "@/types/product";
import { Copy, Check, Loader2 } from "lucide-react";

interface AIEnrichmentProps {
  product: Product | null;
}

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  );
}

interface ContentSectionProps {
  label: string;
  content: string | string[] | null;
  isGenerated: boolean;
}

function ContentSection({ label, content, isGenerated }: ContentSectionProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = Array.isArray(content) ? content.join("\n") : content || "";
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="py-4">
      <h4 className="text-xs uppercase tracking-wider text-text-secondary mb-2">
        {label}
      </h4>
      {isGenerated && content ? (
        <div className="relative bg-white border-l-[3px] border-l-primary-hover p-3 rounded-r-button">
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 p-1.5 text-text-secondary hover:text-primary transition-colors"
            title="Copy to clipboard"
          >
            {copied ? (
              <Check className="w-4 h-4 text-primary" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
          {Array.isArray(content) ? (
            <ul className="text-sm text-text-primary space-y-1.5 pr-8">
              {content.map((bullet, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-text-primary pr-8">{content}</p>
          )}
        </div>
      ) : (
        <div className="border-2 border-dashed border-border-dashed rounded-button p-4 flex items-center justify-center">
          <p className="text-sm text-text-secondary italic">
            Click Generate to create content
          </p>
        </div>
      )}
    </div>
  );
}

export function AIEnrichment({ product }: AIEnrichmentProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<AIContent | null>(null);

  const handleGenerate = async () => {
    if (!product) return;
    setIsGenerating(true);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          temperature: 0.4,
          messages: [
            {
              role: "system",
              content:
                "You are a product content specialist for Nordic Well Group, a Danish supplements and vitamins brand. You write clear, benefit-focused product content in English for the Wellvita brand. Your tone is professional, trustworthy, and health-focused. Never make unsubstantiated medical claims. Return only valid JSON with no markdown, no backticks, no explanation.",
            },
            {
              role: "user",
              content: `Generate enriched product content for this supplement. Return ONLY this JSON structure, nothing else:
{
  "seoTitle": "string, max 60 chars",
  "metaDescription": "string, max 155 chars",
  "productBullets": ["string", "string", "string"]
}

Product name: ${product.name}
Product type: ${product.productType}
Category: ${product.type}
Pills/units: ${product.amountOfPills}
Days of usage: ${product.daysOfUsage}
Description: ${product.description}`,
            },
          ],
        }),
      });

      clearTimeout(timeout);
      const data = await response.json();
      const raw = data.choices?.[0]?.message?.content || "{}";
      const parsed = JSON.parse(raw);

      setGeneratedContent({
        seoTitle: parsed.seoTitle || "",
        metaDescription: parsed.metaDescription || "",
        productBullets: parsed.productBullets || [],
      });
    } catch (err) {
      console.error("Groq API error:", err);
      setGeneratedContent({
        seoTitle: "Generation failed — try again",
        metaDescription: "",
        productBullets: [],
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (!product) {
    return (
      <div className="w-[320px] min-w-[320px] h-full bg-card border-l border-border flex items-center justify-center">
        <p className="text-text-secondary text-sm">Select a product first</p>
      </div>
    );
  }

  return (
    <div className="w-[320px] min-w-[320px] h-full bg-card border-l border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-1">
          <SparkleIcon className="w-5 h-5 text-primary-hover" />
          <h3 className="font-semibold text-text-primary">AI Enrichment</h3>
        </div>
        <p className="text-xs text-text-secondary">
          Powered by Groq · Llama 3.3
        </p>
      </div>

      {/* Generate Button */}
      <div className="p-4">
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-primary rounded-button hover:bg-primary-hover transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Content"
          )}
        </button>
      </div>

      {/* Content Sections */}
      <div className="flex-1 overflow-y-auto px-4">
        <div className="divide-y divide-border">
          <ContentSection
            label="SEO Title"
            content={generatedContent?.seoTitle || null}
            isGenerated={!!generatedContent}
          />
          <ContentSection
            label="Meta Description"
            content={generatedContent?.metaDescription || null}
            isGenerated={!!generatedContent}
          />
          <ContentSection
            label="Product Bullets"
            content={generatedContent?.productBullets || null}
            isGenerated={!!generatedContent}
          />
        </div>
      </div>

      {/* Footer Note */}
      <div className="p-4 border-t border-border">
        <p className="text-xs text-text-secondary text-center">
          Content generated in English. Review before publishing.
        </p>
      </div>
    </div>
  );
}
