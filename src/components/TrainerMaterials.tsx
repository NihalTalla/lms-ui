import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { FileText, Send, Eye } from 'lucide-react';
import { useAuth } from '../lib/auth-context';

interface Material {
  id: string;
  title: string;
  format: 'pdf' | 'doc';
  description: string;
  fileName?: string;
  content?: string;
  assignedTrainerIds: string[];
}

interface MaterialRequest {
  id: string;
  trainerId: string;
  title: string;
  message: string;
  status: 'pending' | 'approved' | 'declined';
  createdAt: string;
}

const MATERIALS_KEY = 'materials_store';
const REQUESTS_KEY = 'material_requests_store';

const loadMaterials = (): Material[] => {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(MATERIALS_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw) as Material[]; } catch { return []; }
};

const saveMaterials = (data: Material[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MATERIALS_KEY, JSON.stringify(data));
};

const saveRequests = (data: MaterialRequest[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(data));
};

const loadRequests = (): MaterialRequest[] => {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(REQUESTS_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw) as MaterialRequest[]; } catch { return []; }
};

export function TrainerMaterials() {
  const { currentUser } = useAuth();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [requests, setRequests] = useState<MaterialRequest[]>([]);
  const [reqTitle, setReqTitle] = useState('');
  const [reqMsg, setReqMsg] = useState('');
  const [viewMat, setViewMat] = useState<Material | null>(null);

  useEffect(() => {
    const mats = loadMaterials();
    const reqs = loadRequests();

    // Seed a demo material for the logged-in trainer if none assigned
    if (currentUser) {
      const hasAny = mats.some(m => m.assignedTrainerIds.includes(currentUser.id));
      if (!hasAny) {
        const demo: Material = {
          id: `demo-${currentUser.id}`,
          title: 'Onboarding Guide',
          description: 'How to start using the platform with your batch',
          format: 'pdf',
          fileName: 'onboarding.pdf',
          content: 'Welcome! This guide covers creating courses, sharing materials and tracking learner progress.',
          assignedTrainerIds: [currentUser.id],
        };
        mats.unshift(demo);
        saveMaterials(mats);
      }
    }

    setMaterials(mats);
    setRequests(reqs);
  }, [currentUser]);

  const myMaterials = useMemo(() => {
    if (!currentUser) return [];
    return materials.filter(m => m.assignedTrainerIds.includes(currentUser.id));
  }, [materials, currentUser]);

  const submitRequest = () => {
    if (!currentUser || !reqTitle.trim()) return;
    const req: MaterialRequest = {
      id: `req-${Date.now()}`,
      trainerId: currentUser.id,
      title: reqTitle,
      message: reqMsg,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    const next = [req, ...requests];
    setRequests(next);
    saveRequests(next);
    setReqTitle('');
    setReqMsg('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-neutral-900">Materials</h2>
          <p className="text-neutral-600">Materials assigned to you by Admin.</p>
        </div>
      </div>

      <div className="space-y-3">
        {myMaterials.length === 0 ? (
          <Card><CardContent className="p-8 text-center text-neutral-500">No materials assigned yet.</CardContent></Card>
        ) : (
          myMaterials.map(mat => (
            <Card key={mat.id} className="border-neutral-200">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-neutral-500" />
                    <div>
                      <h3 className="font-semibold text-neutral-900">{mat.title}</h3>
                      <p className="text-sm text-neutral-500">{mat.description || 'No description'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">{mat.format}</Badge>
                    <Button size="sm" variant="outline" onClick={() => setViewMat(mat)}>
                      <Eye className="w-4 h-4 mr-1" /> View
                    </Button>
                  </div>
                </div>
                {mat.fileName && <p className="text-xs text-neutral-500">Attachment: {mat.fileName}</p>}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Card>
        <CardContent className="p-4 space-y-3">
          <h3 className="font-semibold text-neutral-900">Request additional material</h3>
          <Input placeholder="Topic / title" value={reqTitle} onChange={(e) => setReqTitle(e.target.value)} />
          <Textarea placeholder="Describe what you need" value={reqMsg} onChange={(e) => setReqMsg(e.target.value)} />
          <div className="flex justify-end">
            <Button onClick={submitRequest}><Send className="w-4 h-4 mr-2" />Send request</Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!viewMat} onOpenChange={() => setViewMat(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{viewMat?.title}</DialogTitle>
            <DialogDescription className="flex items-center gap-2">
              <Badge variant="outline" className="capitalize">{viewMat?.format}</Badge>
              {viewMat?.fileName && <span className="text-xs text-neutral-500">Attached: {viewMat.fileName}</span>}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-neutral-700 whitespace-pre-wrap">{viewMat?.description}</p>
            <div className="bg-neutral-100 border border-neutral-200 rounded-lg p-4">
              <div className="bg-white border border-neutral-200 rounded-md shadow-sm p-6 max-h-[55vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-200 mb-4">
                  <div>
                    <h4 className="font-semibold text-neutral-900">{viewMat?.fileName || viewMat?.title}</h4>
                    <p className="text-xs text-neutral-500 uppercase tracking-wider">
                      {viewMat?.format === 'pdf' ? 'PDF Document' : 'Word Document'}
                    </p>
                  </div>
                  <Badge variant="outline" className="capitalize">{viewMat?.format}</Badge>
                </div>
                <div className="space-y-3 text-sm text-neutral-800 leading-relaxed whitespace-pre-wrap">
                  {viewMat?.content || 'No document text available. Attach a file or paste content to preview it here.'}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
