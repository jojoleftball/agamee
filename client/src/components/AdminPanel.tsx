import { useState, useRef } from 'react';
import { useDialogueStore, AdminDialogue } from '@/lib/stores/useDialogueStore';
import { X, Plus, Trash2, Edit2, Save, Upload, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AdminPanelProps {
  onClose: () => void;
}

export default function AdminPanel({ onClose }: AdminPanelProps) {
  const { dialogues, addDialogue, updateDialogue, deleteDialogue, getDialoguesByOrder } = useDialogueStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    talker: 'soly' as 'soly' | 'maria' | 'baby' | 'both',
    content: '',
    iconUrl: '',
    nextAction: 'continue' as 'continue' | 'end' | 'custom',
    customAction: '',
    order: dialogues.length + 1,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sortedDialogues = getDialoguesByOrder();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, iconUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      updateDialogue(editingId, formData);
      setEditingId(null);
    } else {
      addDialogue(formData);
    }

    setFormData({
      talker: 'soly',
      content: '',
      iconUrl: '',
      nextAction: 'continue',
      customAction: '',
      order: dialogues.length + 1,
    });
  };

  const handleEdit = (dialogue: AdminDialogue) => {
    setEditingId(dialogue.id);
    setFormData({
      talker: dialogue.talker,
      content: dialogue.content,
      iconUrl: dialogue.iconUrl,
      nextAction: dialogue.nextAction,
      customAction: dialogue.customAction || '',
      order: dialogue.order,
    });
  };

  const handleMoveUp = (dialogue: AdminDialogue) => {
    const currentIndex = sortedDialogues.findIndex(d => d.id === dialogue.id);
    if (currentIndex > 0) {
      const newDialogues = [...sortedDialogues];
      [newDialogues[currentIndex - 1].order, newDialogues[currentIndex].order] = 
        [newDialogues[currentIndex].order, newDialogues[currentIndex - 1].order];
      newDialogues.forEach(d => updateDialogue(d.id, { order: d.order }));
    }
  };

  const handleMoveDown = (dialogue: AdminDialogue) => {
    const currentIndex = sortedDialogues.findIndex(d => d.id === dialogue.id);
    if (currentIndex < sortedDialogues.length - 1) {
      const newDialogues = [...sortedDialogues];
      [newDialogues[currentIndex + 1].order, newDialogues[currentIndex].order] = 
        [newDialogues[currentIndex].order, newDialogues[currentIndex + 1].order];
      newDialogues.forEach(d => updateDialogue(d.id, { order: d.order }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl my-8">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Dialogue Management</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{editingId ? 'Edit Dialogue' : 'Add New Dialogue'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Talker</label>
                    <Select
                      value={formData.talker}
                      onValueChange={(value: any) => setFormData({ ...formData, talker: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="soly">Soly</SelectItem>
                        <SelectItem value="maria">Maria</SelectItem>
                        <SelectItem value="baby">Baby</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Content</label>
                    <Textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Enter dialogue text..."
                      rows={4}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Character Icon</label>
                    <div className="flex gap-2">
                      <Input
                        value={formData.iconUrl}
                        onChange={(e) => setFormData({ ...formData, iconUrl: e.target.value })}
                        placeholder="Image URL or upload..."
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="w-4 h-4" />
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                    {formData.iconUrl && (
                      <img
                        src={formData.iconUrl}
                        alt="Preview"
                        className="mt-2 w-20 h-20 object-cover rounded"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Order</label>
                    <Input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                      min={1}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Next Action</label>
                    <Select
                      value={formData.nextAction}
                      onValueChange={(value: any) => setFormData({ ...formData, nextAction: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="continue">Continue to Next</SelectItem>
                        <SelectItem value="end">End Dialogue</SelectItem>
                        <SelectItem value="custom">Custom Action</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.nextAction === 'custom' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Custom Action</label>
                      <Input
                        value={formData.customAction}
                        onChange={(e) => setFormData({ ...formData, customAction: e.target.value })}
                        placeholder="e.g., open_shop, start_task"
                      />
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">
                      <Save className="w-4 h-4 mr-2" />
                      {editingId ? 'Update' : 'Add'} Dialogue
                    </Button>
                    {editingId && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setEditingId(null);
                          setFormData({
                            talker: 'soly',
                            content: '',
                            iconUrl: '',
                            nextAction: 'continue',
                            customAction: '',
                            order: dialogues.length + 1,
                          });
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Dialogues ({sortedDialogues.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {sortedDialogues.map((dialogue, index) => (
                    <div
                      key={dialogue.id}
                      className="border rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        {dialogue.iconUrl && (
                          <img
                            src={dialogue.iconUrl}
                            alt={dialogue.talker}
                            className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-sm text-gray-700">
                              {dialogue.talker.charAt(0).toUpperCase() + dialogue.talker.slice(1)}
                            </span>
                            <span className="text-xs text-gray-500">#{dialogue.order}</span>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">{dialogue.content}</p>
                          <span className="text-xs text-gray-400 mt-1 block">
                            {dialogue.nextAction}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleMoveUp(dialogue)}
                            disabled={index === 0}
                          >
                            <ArrowUp className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleMoveDown(dialogue)}
                            disabled={index === sortedDialogues.length - 1}
                          >
                            <ArrowDown className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleEdit(dialogue)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-red-500 hover:text-red-700"
                            onClick={() => {
                              if (confirm('Delete this dialogue?')) {
                                deleteDialogue(dialogue.id);
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
