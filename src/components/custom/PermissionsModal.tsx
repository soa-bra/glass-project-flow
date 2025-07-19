import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { X, Shield, Eye, Edit3, Download, Upload, Trash2, User, Users, Lock, Unlock, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
interface PermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}
interface Permission {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  enabled: boolean;
}
interface UserRole {
  id: string;
  name: string;
  permissions: string[];
  color: string;
}
export const PermissionsModal: React.FC<PermissionsModalProps> = ({
  isOpen,
  onClose
}) => {
  const {
    toast
  } = useToast();

  // صلاحيات الملفات المتاحة
  const [filePermissions] = useState<Permission[]>([{
    id: 'view',
    name: 'عرض الملفات',
    description: 'إمكانية عرض وقراءة الملفات',
    icon: Eye,
    enabled: true
  }, {
    id: 'download',
    name: 'تحميل الملفات',
    description: 'إمكانية تحميل الملفات للجهاز',
    icon: Download,
    enabled: true
  }, {
    id: 'upload',
    name: 'رفع الملفات',
    description: 'إمكانية رفع ملفات جديدة',
    icon: Upload,
    enabled: false
  }, {
    id: 'edit',
    name: 'تعديل الملفات',
    description: 'إمكانية تعديل وتحرير الملفات',
    icon: Edit3,
    enabled: false
  }, {
    id: 'delete',
    name: 'حذف الملفات',
    description: 'إمكانية حذف الملفات نهائياً',
    icon: Trash2,
    enabled: false
  }]);

  // أدوار المستخدمين
  const [userRoles, setUserRoles] = useState<UserRole[]>([{
    id: 'viewer',
    name: 'مشاهد',
    permissions: ['view'],
    color: '#10b981'
  }, {
    id: 'editor',
    name: 'محرر',
    permissions: ['view', 'download', 'edit'],
    color: '#3b82f6'
  }, {
    id: 'admin',
    name: 'مدير',
    permissions: ['view', 'download', 'upload', 'edit', 'delete'],
    color: '#ef4444'
  }]);
  const [selectedRole, setSelectedRole] = useState<string>('viewer');
  const [isRestrictedAccess, setIsRestrictedAccess] = useState(false);
  const handleSavePermissions = () => {
    toast({
      title: "تم حفظ الصلاحيات",
      description: "تم تحديث صلاحيات الوصول للملفات بنجاح"
    });
    onClose();
  };
  const togglePermissionForRole = (roleId: string, permissionId: string) => {
    setUserRoles(prev => prev.map(role => {
      if (role.id === roleId) {
        const hasPermission = role.permissions.includes(permissionId);
        return {
          ...role,
          permissions: hasPermission ? role.permissions.filter(p => p !== permissionId) : [...role.permissions, permissionId]
        };
      }
      return role;
    }));
  };
  return <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden font-arabic" style={{
      background: 'rgba(255,255,255,0.4)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.2)',
      borderRadius: '24px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
      zIndex: 9999
    }}>
        <DialogTitle className="sr-only">إدارة صلاحيات الوصول للملفات</DialogTitle>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-black/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black/10 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-black" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-black">إدارة الصلاحيات</h2>
              <p className="text-sm text-black/70">تحديد صلاحيات الوصول للملفات والمجلدات</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-transparent hover:bg-black/5 rounded-full flex items-center justify-center transition-colors">
            <X className="w-5 h-5 text-black" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-6">
            
            {/* إعدادات الوصول العامة */}
            <div className="bg-white/30 rounded-3xl p-6 border border-black/10">
              <h3 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                إعدادات الوصول العامة
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/20 rounded-2xl border border-black/10">
                  <div className="flex items-center gap-3">
                    {isRestrictedAccess ? <Lock className="w-5 h-5 text-red-600" /> : <Unlock className="w-5 h-5 text-green-600" />}
                    <div>
                      <h4 className="font-medium text-black">وضع الوصول المقيد</h4>
                      <p className="text-xs text-black/70">
                        {isRestrictedAccess ? 'الوصول مقيد بناءً على الأدوار المحددة' : 'وصول مفتوح لجميع أعضاء المشروع'}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setIsRestrictedAccess(!isRestrictedAccess)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${isRestrictedAccess ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-green-500 text-white hover:bg-green-600'}`}>
                    {isRestrictedAccess ? 'مقيد' : 'مفتوح'}
                  </button>
                </div>
              </div>
            </div>

            {/* أدوار المستخدمين وصلاحياتهم */}
            <div className="bg-white/30 rounded-3xl p-6 border border-black/10">
              <h3 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                أدوار المستخدمين
              </h3>
              
              <div className="space-y-4">
                {userRoles.map(role => <div key={role.id} className="bg-white/20 rounded-2xl p-4 border border-black/10">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full" style={{
                      backgroundColor: role.color
                    }} />
                        <h4 className="font-medium text-black">{role.name}</h4>
                      </div>
                      <span className="text-xs text-black/70">
                        {role.permissions.length} من {filePermissions.length} صلاحية
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {filePermissions.map(permission => {
                    const IconComponent = permission.icon;
                    const hasPermission = role.permissions.includes(permission.id);
                    return <button key={permission.id} onClick={() => togglePermissionForRole(role.id, permission.id)} className={`p-3 rounded-xl border transition-all text-right ${hasPermission ? 'border-green-500 bg-green-50 text-green-700' : 'border-black/20 bg-white/30 text-black/70 hover:border-black/40'}`}>
                            <div className="flex items-center gap-2">
                              <IconComponent className="w-4 h-4" />
                              <div className="text-xs">
                                <div className="font-medium">{permission.name}</div>
                                <div className="opacity-70">{permission.description}</div>
                              </div>
                            </div>
                          </button>;
                  })}
                    </div>
                  </div>)}
              </div>
            </div>

            {/* المستخدمون وصلاحياتهم للملفات */}
            <div className="bg-white/30 rounded-3xl p-6 border border-black/10">
              <h3 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                صلاحيات المستخدمين للملفات
              </h3>
              
              <div className="space-y-6">
                {(() => {
                // نقل state خارج map لتجنب خطأ hooks
                const [expandedUser, setExpandedUser] = useState<string | null>(null);
                const [userFilePermissions, setUserFilePermissions] = useState<{
                  [key: string]: string[];
                }>({});

                // بيانات المستخدمين
                const users = [{
                  id: 'user1',
                  name: 'أحمد محمد',
                  email: 'ahmed@company.com',
                  role: 'admin',
                  avatar: '👨‍💼'
                }, {
                  id: 'user2',
                  name: 'فاطمة أحمد',
                  email: 'fatima@company.com',
                  role: 'editor',
                  avatar: '👩‍💻'
                }, {
                  id: 'user3',
                  name: 'خالد سعد',
                  email: 'khalid@company.com',
                  role: 'viewer',
                  avatar: '👨‍🎓'
                }, {
                  id: 'user4',
                  name: 'نورا عبدالله',
                  email: 'nora@company.com',
                  role: 'editor',
                  avatar: '👩‍🎨'
                }];

                // ملفات المشروع الفعلية (يجب استلامها من props أو context)
                const projectFiles = [{
                  id: 'file1',
                  name: 'وثيقة المتطلبات الفنية.pdf',
                  type: 'document',
                  size: '2.4 MB',
                  uploadedBy: 'أحمد محمد',
                  uploadDate: '2024-01-15'
                }, {
                  id: 'file2',
                  name: 'تصميم واجهة المستخدم.fig',
                  type: 'design',
                  size: '15.7 MB',
                  uploadedBy: 'فاطمة أحمد',
                  uploadDate: '2024-01-14'
                }, {
                  id: 'file3',
                  name: 'عرض تقديمي للعميل.pptx',
                  type: 'presentation',
                  size: '8.9 MB',
                  uploadedBy: 'خالد عبدالرحمن',
                  uploadDate: '2024-01-13'
                }, {
                  id: 'file4',
                  name: 'فيديو شرح النظام.mp4',
                  type: 'video',
                  size: '125.3 MB',
                  uploadedBy: 'نورا سعد',
                  uploadDate: '2024-01-12'
                }, {
                  id: 'file5',
                  name: 'ملف النسخ الاحتياطية.zip',
                  type: 'archive',
                  size: '45.2 MB',
                  uploadedBy: 'أحمد محمد',
                  uploadDate: '2024-01-11'
                }];
                const toggleFilePermission = (userId: string, fileId: string, permissionId: string) => {
                  const key = `${userId}_${fileId}`;
                  setUserFilePermissions(prev => ({
                    ...prev,
                    [key]: prev[key]?.includes(permissionId) ? prev[key].filter(p => p !== permissionId) : [...(prev[key] || []), permissionId]
                  }));
                };
                const getFileIcon = (fileType: string) => {
                  switch (fileType) {
                    case 'document':
                      return '📄';
                    case 'design':
                      return '🎨';
                    case 'presentation':
                      return '📊';
                    case 'video':
                      return '🎥';
                    case 'archive':
                      return '📦';
                    default:
                      return '📄';
                  }
                };

                // إعداد الصلاحيات الافتراضية لكل مستخدم
                React.useEffect(() => {
                  const defaultPermissions: {
                    [key: string]: string[];
                  } = {};
                  users.forEach(user => {
                    projectFiles.forEach(file => {
                      const key = `${user.id}_${file.id}`;
                      if (user.role === 'admin') {
                        defaultPermissions[key] = ['view', 'download', 'upload', 'edit', 'delete'];
                      } else if (user.role === 'editor') {
                        defaultPermissions[key] = ['view', 'download', 'edit'];
                      } else {
                        defaultPermissions[key] = ['view'];
                      }
                    });
                  });
                  setUserFilePermissions(defaultPermissions);
                }, []);
                return users.map(user => {
                  const userRole = userRoles.find(r => r.id === user.role);
                  return <div key={user.id} className="bg-white/20 rounded-2xl border border-black/10 overflow-hidden">
                        {/* معلومات المستخدم */}
                        <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/30 transition-colors" onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-black/10 rounded-full flex items-center justify-center text-lg">
                              {user.avatar}
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-black">{user.name}</h4>
                              <p className="text-xs text-black/70">{user.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{
                            backgroundColor: userRole?.color
                          }} />
                              <span className="text-sm text-black">{userRole?.name}</span>
                            </div>
                            <div className="text-xs text-black/50">
                              {expandedUser === user.id ? '▲' : '▼'}
                            </div>
                          </div>
                        </div>

                        {/* صلاحيات الملفات */}
                        {expandedUser === user.id && <div className="px-4 pb-4 border-t border-black/10">
                            <h5 className="text-sm font-bold text-black mb-3 mt-3">صلاحيات الملفات:</h5>
                            <div className="space-y-3">
                              {projectFiles.map(file => {
                          const currentFilePermissions = userFilePermissions[`${user.id}_${file.id}`] || [];
                          return <div key={file.id} className="bg-white/30 rounded-xl p-3 border border-black/10">
                                    <div className="flex items-center gap-3 mb-2">
                                      <span className="text-lg">{getFileIcon(file.type)}</span>
                                      <div className="flex-1">
                                        <h6 className="text-xs font-medium text-black">{file.name}</h6>
                                        <div className="flex items-center gap-2 text-xs text-black/60">
                                          <span>{file.size}</span>
                                          <span>•</span>
                                          <span>رفعه: {file.uploadedBy}</span>
                                          <span>•</span>
                                          <span>{file.uploadDate}</span>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-1">
                                      {/* عرض الصلاحيات المفعلة */}
                                      {filePermissions.filter(perm => currentFilePermissions.includes(perm.id)).map(permission => {
                                const IconComponent = permission.icon;
                                return <button key={permission.id} onClick={() => toggleFilePermission(user.id, file.id, permission.id)} className="p-2 rounded-lg border bg-green-50 border-green-200 text-green-700 text-xs flex items-center gap-1">
                                            <IconComponent className="w-3 h-3" />
                                            <span className="hidden md:inline">
                                              {permission.name}
                                            </span>
                                          </button>;
                              })}
                                      
                                      {/* عرض الصلاحيات غير المفعلة */}
                                      {filePermissions.filter(perm => !currentFilePermissions.includes(perm.id)).map(permission => {
                                const IconComponent = permission.icon;
                                return <button key={permission.id} onClick={() => toggleFilePermission(user.id, file.id, permission.id)} className="p-2 rounded-lg border border-black/20 bg-white/50 text-black/50 text-xs flex items-center gap-1 hover:border-black/40 transition-colors">
                                            <IconComponent className="w-3 h-3" />
                                            <span className="hidden md:inline">{permission.name}</span>
                                          </button>;
                              })}
                                    </div>
                                  </div>;
                        })}
                            </div>
                          </div>}
                      </div>;
                });
              })()}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-black/10">
          <button onClick={onClose} className="px-6 py-3 bg-white/30 hover:bg-white/40 border border-black/20 rounded-full text-black font-medium transition-colors">
            إلغاء
          </button>
          
        </div>
      </DialogContent>
    </Dialog>;
};