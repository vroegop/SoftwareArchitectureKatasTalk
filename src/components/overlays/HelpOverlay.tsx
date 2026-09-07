import { KEY_BINDINGS } from '../../app/keyboard'
import { site } from '../../content/site'
import { useStore } from '../../app/stores/createStore'
import { useLastKey } from '../../app/stores/keyStore'
import { safeStorage } from '../../app/stores/safeStorage'
import { setSetting, settingsStore, type ThemePreference } from '../../app/stores/settingsStore'
import { ui } from '../../app/stores/uiStore'
import { Dialog } from './Dialog'

export function HelpOverlay({ open }: { open: boolean }) {
  const settings = useStore(settingsStore)
  const lastKey = useLastKey()
  return (
    <Dialog open={open} onClose={ui.closeOverlay} title="Keys and settings" className="dialog-help">
      <div className="help grid-2">
        <section className="stack-sm">
          <h3 className="eyebrow">Clicker test</h3>
          <p className="key-tester">
            {lastKey ? (
              <>
                Last key: <kbd>{lastKey.label}</kbd> <span className="muted">→ {lastKey.action}</span>
              </>
            ) : (
              <span className="muted">Press a button on your clicker; the key it sends shows up here.</span>
            )}
          </p>
          <h3 className="eyebrow">Keys</h3>
          <table className="table keymap">
            <tbody>
              {KEY_BINDINGS.map((b) => (
                <tr key={b.action}>
                  <td>
                    {b.keys.map((k) => (
                      <kbd key={k}>{k}</kbd>
                    ))}
                  </td>
                  <td>{b.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section className="stack">
          <h3 className="eyebrow">Settings</h3>
          <label className="row">
            Theme
            <select value={settings.theme} onChange={(e) => setSetting('theme', e.target.value as ThemePreference)}>
              <option value="dark">Dark (projector)</option>
              <option value="light">Light (phone, print)</option>
              <option value="system">Follow the system</option>
            </select>
          </label>
          <label className="row">
            <input type="checkbox" checked={settings.notes} onChange={(e) => setSetting('notes', e.target.checked)} />
            Show speaker notes
          </label>
          <label className="row">
            <input type="checkbox" checked={settings.sound} onChange={(e) => setSetting('sound', e.target.checked)} />
            Beep when a timer ends
          </label>
          <p className="small muted">
            Timer, theme, risk stickies, the picked kata and checklist ticks are stored in this browser only.
          </p>
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => {
              if (window.confirm('Clear the timer, risk stickies, picked kata and settings stored in this browser?')) {
                safeStorage.clearAll()
                window.location.reload()
              }
            }}
          >
            Reset local data
          </button>
          <p className="small">
            <a href={site.repoUrl} target="_blank" rel="noreferrer">
              Source on GitHub
            </a>{' '}
            · MIT licence · katas by Ted Neward and Neal Ford (public domain)
          </p>
        </section>
      </div>
    </Dialog>
  )
}
