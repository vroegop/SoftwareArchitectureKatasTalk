import type { PageProps } from '../app/pageComponents'
import { storyBlocks } from '../content/story'
import { PageShell } from '../components/shell/PageShell'

export default function StoryPage({ page }: PageProps) {
  return (
    <PageShell page={page}>
      <div className="grid-2">
        {storyBlocks.map((block, i) => (
          <section key={block.title} className="placeholder stack-sm">
            <p className="eyebrow">Placeholder {i + 1} of {storyBlocks.length}</p>
            <h3 className="card-title">{block.title}</h3>
            <p className="muted">{block.prompt}</p>
          </section>
        ))}
        <p className="small muted" style={{ gridColumn: '1 / -1' }}>
          Replace these blocks in <code>src/content/story.ts</code> and the notes in <code>src/content/main-pages.ts</code> before the talk.
        </p>
      </div>
    </PageShell>
  )
}
