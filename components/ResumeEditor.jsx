import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { generateSummary } from '../lib/resumeUtils'

export default function ResumeEditor({ resume, onSave }) {
  const blank = {
    id: null,
    name: '',
    email: '',
    phone: '',
    education: [],
    experience: [],
    skills: [],
    summary: ''
  }

  const [data, setData] = useState(resume || blank)

  useEffect(() => setData(resume || blank), [resume])

  function handleChange(e) {
    const { name, value } = e.target
    setData(d => ({ ...d, [name]: value }))
  }

  // Skills handlers
  function addSkill() { setData(d => ({ ...d, skills: [...d.skills, ''] })) }
  function setSkill(i, val) { const s = [...data.skills]; s[i] = val; setData({ ...data, skills: s }) }
  function removeSkill(i) { const s = [...data.skills]; s.splice(i, 1); setData({ ...data, skills: s }) }

  // Education handlers
  function addEducation() { setData(d => ({ ...d, education: [...(d.education || []), { degree: '', institution: '', years: 0 }] })) }
  function setEducation(i, key, val) { const ed = [...(data.education || [])]; ed[i] = { ...ed[i], [key]: val }; setData({ ...data, education: ed }) }
  function removeEducation(i) { const ed = [...(data.education || [])]; ed.splice(i, 1); setData({ ...data, education: ed }) }

  // Experience handlers
  function addExperience() { setData(d => ({ ...d, experience: [...(d.experience || []), { company: '', role: '', years: 0 }] })) }
  function setExperience(i, key, val) { const ex = [...(data.experience || [])]; ex[i] = { ...ex[i], [key]: val }; setData({ ...data, experience: ex }) }
  function removeExperience(i) { const ex = [...(data.experience || [])]; ex.splice(i, 1); setData({ ...data, experience: ex }) }

  async function save() {
    const payload = { ...data }
    if (!payload.id) payload.id = uuidv4()

    if (!payload.summary || !payload.summary.trim()) {
      payload.summary = generateSummary(payload)
      setData(payload)
    }

    try {
      const res = await fetch('/api/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const saved = await res.json()
      onSave(saved)
    } catch (err) {
      console.error('Save failed', err)
      onSave(payload)
    }
  }

  // Download summary function
  function downloadSummary() {
    const element = document.createElement("a")
    const file = new Blob([data.summary || generateSummary(data)], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = "resume_summary.txt"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="space-y-4 p-4">
      {/* Basic info */}
      <div className="grid grid-cols-2 gap-2">
        <input name="name" value={data.name} onChange={handleChange} placeholder="Full name" className="p-2 border rounded" />
        <input name="email" value={data.email} onChange={handleChange} placeholder="Email" className="p-2 border rounded" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <input name="phone" value={data.phone} onChange={handleChange} placeholder="Phone" className="p-2 border rounded" />
        <button type="button" onClick={() => setData(blank)} className="p-2 bg-red-500 text-white rounded">Clear</button>
      </div>

      {/* Education */}
      <div className="border p-3 rounded bg-white">
        <h3 className="font-semibold">Education</h3>
        {(data.education || []).map((ed, i) => (
          <div key={i} className="grid grid-cols-3 gap-2 mt-2">
            <input value={ed.degree} onChange={(e) => setEducation(i, 'degree', e.target.value)} placeholder="Degree" className="p-2 border rounded" />
            <input value={ed.institution} onChange={(e) => setEducation(i, 'institution', e.target.value)} placeholder="Institution" className="p-2 border rounded" />
            <input type="number" value={ed.years} onChange={(e) => setEducation(i, 'years', Number(e.target.value))} placeholder="Years" className="p-2 border rounded" />
            <div className="col-span-3 text-right">
              <button className="mt-2 px-3 py-1 text-sm text-red-600" onClick={() => removeEducation(i)}>Remove</button>
            </div>
          </div>
        ))}
        <button className="mt-2 p-2 bg-blue-600 text-white rounded" onClick={addEducation}>Add Education</button>
      </div>

      {/* Experience */}
      <div className="border p-3 rounded bg-white">
        <h3 className="font-semibold">Experience</h3>
        {(data.experience || []).map((ex, i) => (
          <div key={i} className="grid grid-cols-3 gap-2 mt-2">
            <input value={ex.company} onChange={(e) => setExperience(i, 'company', e.target.value)} placeholder="Company" className="p-2 border rounded" />
            <input value={ex.role} onChange={(e) => setExperience(i, 'role', e.target.value)} placeholder="Role" className="p-2 border rounded" />
            <input type="number" value={ex.years} onChange={(e) => setExperience(i, 'years', Number(e.target.value))} placeholder="Years" className="p-2 border rounded" />
            <div className="col-span-3 text-right">
              <button className="mt-2 px-3 py-1 text-sm text-red-600" onClick={() => removeExperience(i)}>Remove</button>
            </div>
          </div>
        ))}
        <button className="mt-2 p-2 bg-blue-600 text-white rounded" onClick={addExperience}>Add Experience</button>
      </div>

      {/* Skills */}
      <div className="border p-3 rounded bg-white">
        <h3 className="font-semibold">Skills</h3>
        {data.skills.map((s, i) => (
          <div className="flex gap-2 mt-2" key={i}>
            <input value={s} onChange={(e) => setSkill(i, e.target.value)} className="p-2 border rounded flex-1" />
            <button className="px-3 text-red-600" onClick={() => removeSkill(i)}>Remove</button>
          </div>
        ))}
        <button className="mt-2 p-2 bg-blue-600 text-white rounded" onClick={addSkill}>Add Skill</button>
      </div>

      {/* Summary */}
      <div>
        <label className="block font-semibold">Professional Summary (leave blank to auto-generate)</label>
        <textarea name="summary" value={data.summary} onChange={handleChange} rows={4} className="w-full p-2 border rounded" />
      </div>

      {/* Save */}
      <button className="p-2 bg-green-600 text-white rounded" onClick={save}>Save Resume</button>

      {/* Preview Card */}
      <div className="mt-6 p-4 bg-white bg-opacity-10 backdrop-blur-md rounded-xl shadow-lg border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-2">Summary Preview</h3>

        {/* Education */}
        {data.education.length > 0 && (
          <div className="mb-2">
            <strong className="text-gray-200">Education:</strong>
            <ul className="list-disc list-inside text-gray-200">
              {data.education.map((ed, i) => (
                <li key={i}>{`${ed.degree} from ${ed.institution} (${ed.years} yrs)`}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <div className="mb-2">
            <strong className="text-gray-200">Experience:</strong>
            <ul className="list-disc list-inside text-gray-200">
              {data.experience.map((ex, i) => (
                <li key={i}>{`${ex.role} at ${ex.company} (${ex.years} yrs)`}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <div className="mb-2">
            <strong className="text-gray-200">Skills:</strong>
            <div className="flex flex-wrap gap-2 mt-1">
              {data.skills.map((s, i) => (
                <span key={i} className="px-2 py-1 bg-purple-700 text-white rounded-full text-sm">{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* Summary Text */}
        <div className="mt-2 text-gray-100">{data.summary || generateSummary(data)}</div>

        {/* Download Button */}
        <button
          onClick={downloadSummary}
          className="mt-3 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg shadow-md"
        >
          Download Summary
        </button>
      </div>
    </div>
  )
}
