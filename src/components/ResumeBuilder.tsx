import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Download, Plus, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function ResumeBuilder() {
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      name: 'Emma Wilson',
      email: 'emma.wilson@example.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      linkedin: 'linkedin.com/in/emmawilson',
      github: 'github.com/emmawilson',
    },
    summary: 'Passionate software developer with expertise in data structures and algorithms. Completed 23 coding challenges with a focus on optimal solutions and clean code practices.',
    education: [
      {
        degree: 'Bachelor of Science in Computer Science',
        institution: 'University of California',
        year: '2021 - 2025',
        gpa: '3.8/4.0',
      },
    ],
    experience: [
      {
        title: 'Software Engineering Intern',
        company: 'Tech Corp',
        duration: 'Jun 2024 - Aug 2024',
        description: 'Developed features for web application using React and Node.js. Optimized database queries resulting in 40% performance improvement.',
      },
    ],
    projects: [
      {
        name: 'LeetCode Clone',
        tech: 'React, Node.js, MongoDB',
        description: 'Built a coding practice platform with real-time code execution and automated test case validation.',
      },
    ],
    skills: {
      languages: ['Python', 'JavaScript', 'Java', 'TypeScript'],
      frameworks: ['React', 'Node.js', 'Express'],
      tools: ['Git', 'Docker', 'AWS'],
      concepts: ['Data Structures', 'Algorithms', 'System Design'],
    },
    achievements: [
      'Solved 150+ coding problems on various platforms',
      'Top 5% in Codify LMS leaderboard',
      'Maintained 30-day problem-solving streak',
    ],
  });

  const exportPDF = () => {
    toast.success('Resume exported successfully!', {
      description: 'Your resume has been downloaded as PDF',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2>Resume Builder</h2>
          <p className="text-neutral-600 mt-1">
            Create a professional resume showcasing your coding achievements
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button onClick={exportPDF} style={{ backgroundColor: 'var(--color-primary)' }}>
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={resumeData.personalInfo.name}
                    onChange={(e) =>
                      setResumeData({
                        ...resumeData,
                        personalInfo: { ...resumeData.personalInfo, name: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={resumeData.personalInfo.email}
                    onChange={(e) =>
                      setResumeData({
                        ...resumeData,
                        personalInfo: { ...resumeData.personalInfo, email: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={resumeData.personalInfo.phone}
                    onChange={(e) =>
                      setResumeData({
                        ...resumeData,
                        personalInfo: { ...resumeData.personalInfo, phone: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={resumeData.personalInfo.location}
                    onChange={(e) =>
                      setResumeData({
                        ...resumeData,
                        personalInfo: { ...resumeData.personalInfo, location: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={resumeData.personalInfo.linkedin}
                    onChange={(e) =>
                      setResumeData({
                        ...resumeData,
                        personalInfo: { ...resumeData.personalInfo, linkedin: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github">GitHub</Label>
                  <Input
                    id="github"
                    value={resumeData.personalInfo.github}
                    onChange={(e) =>
                      setResumeData({
                        ...resumeData,
                        personalInfo: { ...resumeData.personalInfo, github: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Professional Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                rows={4}
                value={resumeData.summary}
                onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
                placeholder="Brief overview of your background and goals..."
              />
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Skills</CardTitle>
                <Button size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="mb-2 block">Programming Languages</Label>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.languages.map((lang, index) => (
                    <Badge key={index} variant="outline">
                      {lang}
                      <button className="ml-2">×</button>
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <Label className="mb-2 block">Frameworks & Libraries</Label>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.frameworks.map((framework, index) => (
                    <Badge key={index} variant="outline">
                      {framework}
                      <button className="ml-2">×</button>
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <Label className="mb-2 block">Tools & Technologies</Label>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.tools.map((tool, index) => (
                    <Badge key={index} variant="outline">
                      {tool}
                      <button className="ml-2">×</button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Experience */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Experience</CardTitle>
                <Button size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {resumeData.experience.map((exp, index) => (
                <div key={index} className="p-4 border border-neutral-200 rounded-lg space-y-3">
                  <div className="space-y-2">
                    <Input placeholder="Job Title" value={exp.title} />
                    <div className="grid grid-cols-2 gap-2">
                      <Input placeholder="Company" value={exp.company} />
                      <Input placeholder="Duration" value={exp.duration} />
                    </div>
                    <Textarea
                      rows={3}
                      placeholder="Description"
                      value={exp.description}
                    />
                  </div>
                  <Button variant="ghost" size="sm" className="text-red-600">
                    <Trash2 className="w-3 h-3 mr-1" />
                    Remove
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Live Preview */}
        <div className="lg:sticky lg:top-8 h-fit">
          <Card>
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white border border-neutral-200 rounded-lg p-8 space-y-6" style={{ fontFamily: 'serif' }}>
                {/* Header */}
                <div className="text-center border-b pb-4">
                  <h2 className="text-2xl mb-2">{resumeData.personalInfo.name}</h2>
                  <div className="text-sm text-neutral-600 space-y-1">
                    <p>{resumeData.personalInfo.email} | {resumeData.personalInfo.phone}</p>
                    <p>{resumeData.personalInfo.location}</p>
                    <p>{resumeData.personalInfo.linkedin} | {resumeData.personalInfo.github}</p>
                  </div>
                </div>

                {/* Summary */}
                <div>
                  <h3 className="text-lg border-b border-neutral-300 pb-1 mb-3">Professional Summary</h3>
                  <p className="text-sm text-neutral-700">{resumeData.summary}</p>
                </div>

                {/* Skills */}
                <div>
                  <h3 className="text-lg border-b border-neutral-300 pb-1 mb-3">Technical Skills</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Languages:</strong> {resumeData.skills.languages.join(', ')}</p>
                    <p><strong>Frameworks:</strong> {resumeData.skills.frameworks.join(', ')}</p>
                    <p><strong>Tools:</strong> {resumeData.skills.tools.join(', ')}</p>
                    <p><strong>Concepts:</strong> {resumeData.skills.concepts.join(', ')}</p>
                  </div>
                </div>

                {/* Experience */}
                <div>
                  <h3 className="text-lg border-b border-neutral-300 pb-1 mb-3">Experience</h3>
                  <div className="space-y-3">
                    {resumeData.experience.map((exp, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-start mb-1">
                          <p className="font-semibold text-sm">{exp.title}</p>
                          <p className="text-xs text-neutral-600">{exp.duration}</p>
                        </div>
                        <p className="text-sm text-neutral-600 mb-1">{exp.company}</p>
                        <p className="text-xs text-neutral-700">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div>
                  <h3 className="text-lg border-b border-neutral-300 pb-1 mb-3">Education</h3>
                  <div className="space-y-3">
                    {resumeData.education.map((edu, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-start mb-1">
                          <p className="font-semibold text-sm">{edu.degree}</p>
                          <p className="text-xs text-neutral-600">{edu.year}</p>
                        </div>
                        <p className="text-sm text-neutral-600">{edu.institution}</p>
                        <p className="text-xs text-neutral-700">GPA: {edu.gpa}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Projects */}
                <div>
                  <h3 className="text-lg border-b border-neutral-300 pb-1 mb-3">Projects</h3>
                  <div className="space-y-3">
                    {resumeData.projects.map((project, index) => (
                      <div key={index}>
                        <p className="font-semibold text-sm mb-1">{project.name}</p>
                        <p className="text-xs text-neutral-600 mb-1">{project.tech}</p>
                        <p className="text-xs text-neutral-700">{project.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                <div>
                  <h3 className="text-lg border-b border-neutral-300 pb-1 mb-3">Achievements</h3>
                  <ul className="space-y-1 text-sm">
                    {resumeData.achievements.map((achievement, index) => (
                      <li key={index} className="flex gap-2">
                        <span>•</span>
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
