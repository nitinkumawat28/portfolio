import { useMemo } from "react";
import { deckProjects } from "../../data/deckProjects";
import { ProjectDeck } from "./ProjectDeck";
import type { DeckAction, DeckItem } from "./types";

type Props = {
  /** Called with the project id (same as the case study slug). Open your case study overlay here. */
  onOpenCaseStudy: (slug: string) => void;
};

/** Content for the "Projects" folder. Render this inside your folder overlay. */
export function ProjectsFolderView({ onOpenCaseStudy }: Props) {
  const items = useMemo<DeckItem[]>(
    () =>
      deckProjects.map(({ links, ...project }) => {
        const open: DeckAction = {
          label: "View case study",
          variant: "primary",
          onClick: () => onOpenCaseStudy(project.id),
        };
        // Links still holding a [PLACEHOLDER] are hidden until you fill them in.
        const real = links.filter((l) => !l.href || !l.href.startsWith("["));
        return { ...project, actions: [open, ...real] };
      }),
    [onOpenCaseStudy]
  );

  return (
    <section className="grid min-h-full place-items-center px-4 py-16">
      <ProjectDeck items={items} label="Projects" />
    </section>
  );
}
