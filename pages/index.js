import { useEffect, useState } from 'react'
import ResumeEditor from '../components/ResumeEditor'
import ResumePreview from '../components/ResumePreview'

export default function Home() {
  const [resume, setResume] = useState(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/resumes')
      .then(r => r.json())
      .then(data => {
        if (data && data.length) setResume(data[0])
        else setResume(null)
      })
      .catch(() => setResume(null))
  }, [])

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h1 className="text-2xl font-bold mb-4">Resume Editor</h1>
        <ResumeEditor
          resume={resume}
          onSave={(r) => {
            setResume(r)
            setSaved(true)
            setTimeout(() => setSaved(false), 2000)
          }}
        />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Preview</h2>
        <ResumePreview resume={resume} />
        {saved && <div className="mt-4 text-green-600">Saved ✔</div>}
      </div>
    </div>
  )
}
