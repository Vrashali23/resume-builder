export default function ResumePreview({ resume }) {
  if (!resume) return <div className="p-4 bg-white rounded">No resume yet. Create one in the editor.</div>

  return (
    <div className="p-6 bg-white rounded shadow-sm">
      <h1 className="text-xl font-bold">{resume.name}</h1>
      <div className="text-sm text-slate-600">{resume.email} • {resume.phone}</div>

      <section className="mt-4">
        <h3 className="font-semibold">Summary</h3>
        <p>{resume.summary}</p>
      </section>

      <section className="mt-4">
        <h3 className="font-semibold">Education</h3>
        <ul className="list-disc ml-5 mt-2">
          {(resume.education || []).map((ed, i) => (
            <li key={i}>
              <div className="font-medium">{ed.degree} — {ed.institution}</div>
              <div className="text-sm text-slate-600">{ed.years ? `${ed.years} years` : ''}</div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-4">
        <h3 className="font-semibold">Experience</h3>
        <ul className="list-disc ml-5 mt-2">
          {(resume.experience || []).map((ex, i) => (
            <li key={i}>
              <div className="font-medium">{ex.role} — {ex.company}</div>
              <div className="text-sm text-slate-600">{ex.years ? `${ex.years} years` : ''}</div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-4">
        <h3 className="font-semibold">Skills</h3>
        <div className="flex flex-wrap gap-2 mt-2">
          {(resume.skills || []).map((s, i) => <span key={i} className="px-2 py-1 border rounded text-sm">{s}</span>)}
        </div>
      </section>
    </div>
  )
}
