"use client";

import type { ContentDocument } from "@/lib/content/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type EvidenceView = NonNullable<ContentDocument["evidence"]>[number];

export function EvidenceTabs({ views }: { views: EvidenceView[] }) {
  if (!views.length) return null;

  return (
    <Tabs className="evidence-tabs" defaultValue={views[0].id}>
      <TabsList
        className="evidence-tab-list"
        variant="line"
        aria-label="项目证据视图"
      >
        {views.map((view, index) => (
          <TabsTrigger value={view.id} key={view.id}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            {view.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {views.map((view) => (
        <TabsContent className="evidence-panel" value={view.id} key={view.id}>
          <div className="evidence-window-bar">
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <code>{view.eyebrow}</code>
          </div>
          <div className="evidence-window-body">
            <p className="micro-label">{view.eyebrow}</p>
            <h3>{view.title}</h3>
            {view.summary ? (
              <p className="evidence-summary">{view.summary}</p>
            ) : null}
            <dl className="evidence-list">
              {view.items.map((item) => (
                <div key={`${view.id}-${item.label}`}>
                  <dt>{item.label}</dt>
                  <dd>{item.text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
