// lib/utils.js
export function generateSummary(payload) {
  const parts = [];

  // Education
  if (payload.education && payload.education.length) {
    const first = payload.education[0];
    const deg = first.degree || '';
    const inst = first.institution || '';
    const year = first.graduationYear ? `(${first.graduationYear})` : '';
    if (deg || inst) parts.push(`${deg} graduate from ${inst} ${year}`.trim());
  }

  // Experience
  if (payload.experience && payload.experience.length) {
    const expYears = payload.experience.reduce((acc, e) => acc + (Number(e.years) || 0), 0);
    const roles = payload.experience
      .map(e => e.role || '')
      .filter(Boolean)
      .slice(0, 3)
      .join(', ');
    const companies = payload.experience
      .map(e => e.company || '')
      .filter(Boolean)
      .slice(0, 3)
      .join(', ');

    let expText = '';
    if (expYears) expText += `${expYears} years of practical experience`;
    if (roles) expText += roles ? ` as ${roles}` : '';
    if (companies) expText += companies ? ` at ${companies}` : '';
    if (expText) parts.push(expText);
  }

  // Skills
  if (payload.skills && payload.skills.length) {
    const skills = payload.skills.slice(0, 6).filter(Boolean);
    if (skills.length) parts.push(`Skilled in ${skills.join(', ')}`);
  }

  // Certifications
  if (payload.certifications && payload.certifications.length) {
    const certs = payload.certifications.slice(0, 3).filter(Boolean).join(', ');
    if (certs) parts.push(`Certified in ${certs}`);
  }

  // Projects / Achievements
  if (payload.projects && payload.projects.length) {
    const proj = payload.projects.slice(0, 2).filter(Boolean).join(', ');
    if (proj) parts.push(`Worked on notable projects like ${proj}`);
  }

  // Fallback
  if (!parts.length)
    return `Motivated professional seeking opportunities to apply skills and grow.`;

  return parts.join('. ') + '.';
}
