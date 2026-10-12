import type { Achievement, Certificate, Education, Experience, PortfolioData, Project } from '../../types/portfolio';
import { newId } from '../../data/demo';
import { readImage } from '../../lib/image';
import ListEditor from '../ListEditor';
import { FileUpload, TextArea, TextInput } from '../ui/Field';
import type { StepProps } from './types';

type ListKey = 'education' | 'projects' | 'experience' | 'certificates' | 'achievements';
const upd = <K extends ListKey>(setData: StepProps['setData'], key: K) => (items: PortfolioData[K]) => setData((d) => ({ ...d, [key]: items }));
const row = 'grid gap-4 sm:grid-cols-2';

export function EducationStep({ data, setData, errors }: StepProps) {
  return (
    <ListEditor<Education> items={data.education} onChange={upd(setData, 'education')} noun="education" title={(x) => [x.degree, x.institution].filter(Boolean).join(' · ')}
      make={() => ({ id: newId(), institution: '', degree: '', field: '', startYear: '', endYear: '', grade: '', description: '' })}>
      {(x, p, i) => (
        <>
          <TextInput label="Institution" required value={x.institution} onChange={(v) => p({ institution: v })} error={errors[`education.${i}.institution`]} />
          <div className={row}>
            <TextInput label="Degree" value={x.degree} onChange={(v) => p({ degree: v })} placeholder="BCA" />
            <TextInput label="Field of study" value={x.field} onChange={(v) => p({ field: v })} placeholder="Computer Applications" />
            <TextInput label="Start year" value={x.startYear} onChange={(v) => p({ startYear: v })} placeholder="2024" maxLength={4} error={errors[`education.${i}.startYear`]} />
            <TextInput label="End year" value={x.endYear} onChange={(v) => p({ endYear: v })} placeholder="2027" maxLength={4} error={errors[`education.${i}.endYear`]} />
          </div>
          <TextInput label="Percentage / GPA" value={x.grade} onChange={(v) => p({ grade: v })} hint="Optional" />
          <TextArea label="Description" value={x.description} onChange={(v) => p({ description: v })} rows={3} maxLength={300} />
        </>
      )}
    </ListEditor>
  );
}

export function ProjectsStep({ data, setData, errors }: StepProps) {
  return (
    <ListEditor<Project> items={data.projects} onChange={upd(setData, 'projects')} noun="project" title={(x) => x.name}
      make={() => ({ id: newId(), name: '', shortDescription: '', detailedDescription: '', technologies: '', githubUrl: '', liveUrl: '', image: '', startDate: '', endDate: '' })}>
      {(x, p, i) => (
        <>
          <TextInput label="Project name" required value={x.name} onChange={(v) => p({ name: v })} error={errors[`projects.${i}.name`]} />
          <TextArea label="Short description" value={x.shortDescription} onChange={(v) => p({ shortDescription: v })} rows={2} maxLength={200} hint="One or two sentences shown on the project card." />
          <TextArea label="Detailed description" value={x.detailedDescription} onChange={(v) => p({ detailedDescription: v })} rows={4} maxLength={800} hint="Optional. Visitors can expand it with “More about this project”." />
          <TextInput label="Technologies" value={x.technologies} onChange={(v) => p({ technologies: v })} placeholder="React, Node.js, SQL" hint="Separate with commas." />
          <div className={row}>
            <TextInput label="GitHub URL" type="url" value={x.githubUrl} onChange={(v) => p({ githubUrl: v })} error={errors[`projects.${i}.githubUrl`]} placeholder="https://github.com/…" />
            <TextInput label="Live URL" type="url" value={x.liveUrl} onChange={(v) => p({ liveUrl: v })} error={errors[`projects.${i}.liveUrl`]} placeholder="https://…" />
            <TextInput label="Start date" type="month" value={x.startDate} onChange={(v) => p({ startDate: v })} />
            <TextInput label="Completion date" type="month" value={x.endDate} onChange={(v) => p({ endDate: v })} error={errors[`projects.${i}.endDate`]} hint="Leave empty if ongoing." />
          </div>
          <FileUpload label="Project image" accept="image/*" hint="A screenshot works best." preview={x.image} hasFile={!!x.image} onFile={async (f) => p({ image: await readImage(f, 960) })} onRemove={() => p({ image: '' })} />
        </>
      )}
    </ListEditor>
  );
}

export function ExperienceStep({ data, setData, errors }: StepProps) {
  return (
    <ListEditor<Experience> items={data.experience} onChange={upd(setData, 'experience')} noun="experience" title={(x) => [x.role, x.organization].filter(Boolean).join(' · ')}
      make={() => ({ id: newId(), organization: '', role: '', startDate: '', endDate: '', description: '', responsibilities: '', achievements: '' })}>
      {(x, p, i) => (
        <>
          <div className={row}>
            <TextInput label="Organization" value={x.organization} onChange={(v) => p({ organization: v })} error={errors[`experience.${i}.organization`]} />
            <TextInput label="Role" value={x.role} onChange={(v) => p({ role: v })} />
            <TextInput label="Start date" type="month" value={x.startDate} onChange={(v) => p({ startDate: v })} />
            <TextInput label="End date" type="month" value={x.endDate} onChange={(v) => p({ endDate: v })} error={errors[`experience.${i}.endDate`]} hint="Leave empty if current." />
          </div>
          <TextArea label="Description" value={x.description} onChange={(v) => p({ description: v })} rows={3} maxLength={400} />
          <TextArea label="Responsibilities" value={x.responsibilities} onChange={(v) => p({ responsibilities: v })} rows={3} hint="One per line." />
          <TextArea label="Achievements" value={x.achievements} onChange={(v) => p({ achievements: v })} rows={3} hint="One per line." />
        </>
      )}
    </ListEditor>
  );
}

export function CertificatesStep({ data, setData, errors }: StepProps) {
  return (
    <ListEditor<Certificate> items={data.certificates} onChange={upd(setData, 'certificates')} noun="certificate" title={(x) => x.name}
      make={() => ({ id: newId(), name: '', issuer: '', issueDate: '', credentialId: '', credentialUrl: '', image: '' })}>
      {(x, p, i) => (
        <>
          <TextInput label="Certificate name" required value={x.name} onChange={(v) => p({ name: v })} error={errors[`certificates.${i}.name`]} />
          <div className={row}>
            <TextInput label="Issuing organization" value={x.issuer} onChange={(v) => p({ issuer: v })} />
            <TextInput label="Issue date" type="month" value={x.issueDate} onChange={(v) => p({ issueDate: v })} />
            <TextInput label="Credential ID" value={x.credentialId} onChange={(v) => p({ credentialId: v })} />
            <TextInput label="Credential URL" type="url" value={x.credentialUrl} onChange={(v) => p({ credentialUrl: v })} error={errors[`certificates.${i}.credentialUrl`]} placeholder="https://…" />
          </div>
          <FileUpload label="Certificate image" accept="image/*" hint="Optional." preview={x.image} hasFile={!!x.image} onFile={async (f) => p({ image: await readImage(f, 960) })} onRemove={() => p({ image: '' })} />
        </>
      )}
    </ListEditor>
  );
}

export function AchievementsStep({ data, setData, errors }: StepProps) {
  return (
    <ListEditor<Achievement> items={data.achievements} onChange={upd(setData, 'achievements')} noun="achievement" title={(x) => x.title}
      make={() => ({ id: newId(), title: '', description: '', date: '', url: '' })}>
      {(x, p, i) => (
        <>
          <TextInput label="Title" required value={x.title} onChange={(v) => p({ title: v })} error={errors[`achievements.${i}.title`]} />
          <TextArea label="Description" value={x.description} onChange={(v) => p({ description: v })} rows={3} maxLength={300} />
          <div className={row}>
            <TextInput label="Date" type="month" value={x.date} onChange={(v) => p({ date: v })} />
            <TextInput label="URL" type="url" value={x.url} onChange={(v) => p({ url: v })} error={errors[`achievements.${i}.url`]} placeholder="https://…" />
          </div>
        </>
      )}
    </ListEditor>
  );
}
