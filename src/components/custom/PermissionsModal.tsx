import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { 
  X, 
  Shield, 
  Eye, 
  Edit3, 
  Download, 
  Upload, 
  Trash2,
  User,
  Users,
  Lock,
  Unlock,
  Settings,
  MessageCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ProjectFile } from '@/data/projectFiles';
import { useProjectFiles } from '@/hooks/useProjectFiles';

interface PermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
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
  onClose,
  projectId = 'current'
}) => {
  const { toast } = useToast();

  // استخدام hook البيانات المشتركة  
  const { files: projectFilesList, setUserPermissions: updateUserPermissions } = useProjectFiles(projectId);

  // صلاحيات الملفات المتاحة
  const [filePermissions] = useState<Permission[]>([
    {
      id: 'view',
      name: 'عرض الملفات',
      description: 'إمكانية عرض وقراءة الملفات',
      icon: Eye,
      enabled: true
    },
    {
      id: 'download',
      name: 'تحميل الملفات',
      description: 'إمكانية تحميل الملفات للجهاز',
      icon: Download,
      enabled: true
    },
    {
      id: 'comment',
      name: 'التعليق على الملفات',
      description: 'إمكانية إضافة تعليقات على الملفات',
      icon: MessageCircle,
      enabled: true
    },
    {
      id: 'upload',
      name: 'رفع الملفات',
      description: 'إمكانية رفع ملفات جديدة',
      icon: Upload,
      enabled: false
    },
    {
      id: 'edit',
      name: 'تعديل الملفات',
      description: 'إمكانية تعديل وتحرير الملفات',
      icon: Edit3,
      enabled: false
    },
    {
      id: 'delete',
      name: 'حذف الملفات',
      description: 'إمكانية حذف الملفات نهائياً',
      icon: Trash2,
      enabled: false
    }
  ]);

  const [userRoles, setUserRoles] = useState<UserRole[]>([
    {
      id: 'viewer',
      name: 'مشاهد',
      permissions: ['view'],
      color: '#6b7280'
    },
    {
      id: 'commenter',
      name: 'معلق',
      permissions: ['view', 'comment'],
      color: '#10b981'
    },
    {
      id: 'contributor',
      name: 'مشارك',
      permissions: ['view', 'download', 'comment', 'upload'],
      color: '#3b82f6'
    },
    {
      id: 'editor',
      name: 'محرر',
      permissions: ['view', 'download', 'comment', 'upload', 'edit', 'delete'],
      color: '#ef4444'
    }
  ]);

  const [selectedRole, setSelectedRole] = useState<string>('viewer');
  const [isRestrictedAccess, setIsRestrictedAccess] = useState(false);

  const handleSavePermissions = () => {
    toast({
      title: "تم حفظ الصلاحيات",
      description: "تم تحديث صلاحيات الوصول للملفات بنجاح",
    });
    onClose();
  };

  const togglePermissionForRole = (roleId: string, permissionId: string) => {
    setUserRoles(prev => prev.map(role => {
      if (role.id === roleId) {
        const hasPermission = role.permissions.includes(permissionId);
        return {
          ...role,
          permissions: hasPermission 
            ? role.permissions.filter(p => p !== permissionId)
            : [...role.permissions, permissionId]
        };
      }
      return role;
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent 
        className="max-w-4xl max-h-[90vh] p-0 overflow-hidden font-arabic"
      >
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
          <button
            onClick={onClose}
            className="w-8 h-8 bg-transparent hover:bg-black/5 rounded-full flex items-center justify-center transition-colors"
          >
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
                    {isRestrictedAccess ? (
                      <Lock className="w-5 h-5 text-red-600" />
                    ) : (
                      <Unlock className="w-5 h-5 text-green-600" />
                    )}
                    <div>
                      <h4 className="font-medium text-black">وضع الوصول المقيد</h4>
                      <p className="text-xs text-black/70">
                        {isRestrictedAccess 
                          ? 'الوصول مقيد بناءً على الأدوار المحددة' 
                          : 'وصول مفتوح لجميع أعضاء المشروع'
                        }
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsRestrictedAccess(!isRestrictedAccess)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      isRestrictedAccess 
                        ? 'bg-red-500 text-white hover:bg-red-600' 
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
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
                {userRoles.map((role) => (
                  <div key={role.id} className="bg-white/20 rounded-2xl p-4 border border-black/10">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: role.color }}
                        />
                        <h4 className="font-medium text-black">{role.name}</h4>
                      </div>
                      <span className="text-xs text-black/70">
                        {role.permissions.length} من {filePermissions.length} صلاحية
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {filePermissions.map((permission) => {
                        const IconComponent = permission.icon;
                        const hasPermission = role.permissions.includes(permission.id);
                        
                        return (
                          <button
                            key={permission.id}
                            onClick={() => togglePermissionForRole(role.id, permission.id)}
                            className={`p-3 rounded-xl border transition-all text-right ${
                              hasPermission
                                ? 'border-green-500 bg-green-50 text-green-700'
                                : 'border-black/20 bg-white/30 text-black/70 hover:border-black/40'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <IconComponent className="w-4 h-4" />
                              <div className="text-xs">
                                <div className="font-medium">{permission.name}</div>
                                <div className="opacity-70">{permission.description}</div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
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
                  const [userFilePermissions, setUserFilePermissions] = useState<{[key: string]: string[]}>({});

                  // بيانات المستخدمين
                  const [users, setUsers] = useState([
                    { 
                      id: 'user1',
                      name: 'أحمد محمد', 
                      email: 'ahmed@company.com', 
                      role: 'editor'
                    },
                    { 
                      id: 'user2',
                      name: 'فاطمة أحمد', 
                      email: 'fatima@company.com', 
                      role: 'contributor'
                    },
                    { 
                      id: 'user3',
                      name: 'خالد سعد', 
                      email: 'khalid@company.com', 
                      role: 'commenter'
                    },
                    { 
                      id: 'user4',
                      name: 'نورا عبدالله', 
                      email: 'nora@company.com', 
                      role: 'viewer'
                    }
                  ]);

                  const toggleFilePermission = (userId: string, fileId: string, permissionId: string) => {
                    const key = `${userId}_${fileId}`;
                    setUserFilePermissions(prev => ({
                      ...prev,
                      [key]: prev[key]?.includes(permissionId)
                        ? prev[key].filter(p => p !== permissionId)
                        : [...(prev[key] || []), permissionId]
                    }));
                  };

                  const getFileIcon = (fileType: string) => {
                    switch (fileType) {
                      case 'document': return '📄';
                      case 'image': return '🖼️';
                      case 'video': return '🎥';
                      case 'audio': return '🎵';
                      case 'archive': return '📦';
                      case 'other': return '📄';
                      default: return '📄';
                    }
                  };

                  // تحديث دور المستخدم
                  const updateUserRole = (userId: string, newRoleId: string) => {
                    setUsers(prev => prev.map(user => 
                      user.id === userId ? { ...user, role: newRoleId } : user
                    ));
                    
                    // تحديث صلاحيات الملفات تلقائياً بناءً على الدور الجديد
                    const newRole = userRoles.find(r => r.id === newRoleId);
                    if (newRole) {
                      const updatedPermissions: {[key: string]: string[]} = {};
                      projectFilesList.forEach(file => {
                        const key = `${userId}_${file.id}`;
                        updatedPermissions[key] = [...newRole.permissions];
                      });
                      setUserFilePermissions(prev => ({
                        ...prev,
                        ...updatedPermissions
                      }));
                    }
                    
                    toast({
                      title: "تم تحديث الدور",
                      description: `تم تحديث دور المستخدم إلى ${newRole?.name}`,
                    });
                  };

                  // إعداد الصلاحيات الافتراضية لكل مستخدم
                  React.useEffect(() => {
                    const defaultPermissions: {[key: string]: string[]} = {};
                    users.forEach(user => {
                      const userRole = userRoles.find(r => r.id === user.role);
                      projectFilesList.forEach(file => {
                        const key = `${user.id}_${file.id}`;
                        defaultPermissions[key] = userRole ? [...userRole.permissions] : ['view'];
                      });
                    });
                    setUserFilePermissions(defaultPermissions);
                  }, [users]);

                  return users.map((user) => {
                    const userRole = userRoles.find(r => r.id === user.role);

                    return (
                      <div key={user.id} className="bg-white/20 rounded-2xl border border-black/10 overflow-hidden">
                        {/* معلومات المستخدم */}
                        <div 
                          className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/30 transition-colors"
                          onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div>
                              <h4 className="text-sm font-medium text-black">{user.name}</h4>
                              <p className="text-xs text-black/70">{user.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: userRole?.color }}
                              />
                              <span className="text-sm text-black">{userRole?.name}</span>
                            </div>
                            <div className="text-xs text-black/50">
                              {expandedUser === user.id ? '▲' : '▼'}
                            </div>
                          </div>
                        </div>

                        {/* تخصيص الصلاحيات */}
                        {expandedUser === user.id && (
                          <div className="px-4 pb-4 border-t border-black/10">
                            <div className="space-y-6 mt-4">
                              
                              {/* القسم الأول: تحديد الدور */}
                              <div className="bg-white/30 rounded-xl p-4 border border-black/10">
                                <h5 className="text-sm font-bold text-black mb-3 flex items-center gap-2">
                                  <User className="w-4 h-4" />
                                  تحديد الدور
                                </h5>
                                <div className="grid grid-cols-4 gap-2">
                                  {userRoles.map((role) => {
                                    const isSelected = user.role === role.id;
                                    
                                    return (
                                      <button
                                        key={role.id}
                                        onClick={() => updateUserRole(user.id, role.id)}
                                        className={`p-3 rounded-lg border text-xs transition-all ${
                                          isSelected
                                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                                            : 'border-black/20 bg-white/50 text-black/70 hover:border-black/40'
                                        }`}
                                      >
                                        <div className="flex items-center gap-2">
                                          <div 
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: role.color }}
                                          />
                                          <span className="font-medium">{role.name}</span>
                                        </div>
                                        <div className="text-xs opacity-70 mt-1">
                                          {role.permissions.length} صلاحية
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* القسم الثاني: صلاحيات الملفات */}
                              <div className="bg-white/30 rounded-xl p-4 border border-black/10">
                                <h5 className="text-sm font-bold text-black mb-3 flex items-center gap-2">
                                  <Eye className="w-4 h-4" />
                                  صلاحيات الملفات
                                </h5>
                                <div className="space-y-3">
                                  {projectFilesList.map((file) => {
                                    const currentFilePermissions = userFilePermissions[`${user.id}_${file.id}`] || [];
                                    
                                    return (
                                      <div key={file.id} className="bg-white/40 rounded-lg p-3 border border-black/10">
                                         <div className="flex items-center gap-3 mb-2">
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
                                          {filePermissions.filter(perm => currentFilePermissions.includes(perm.id)).map((permission) => {
                                            const IconComponent = permission.icon;
                                            
                                            return (
                                              <button
                                                key={permission.id}
                                                onClick={() => toggleFilePermission(user.id, file.id, permission.id)}
                                                className="p-2 rounded-lg border bg-green-50 border-green-200 text-green-700 text-xs flex items-center gap-1"
                                              >
                                                <IconComponent className="w-3 h-3" />
                                                <span className="hidden md:inline">
                                                  {permission.name}
                                                </span>
                                              </button>
                                            );
                                          })}
                                          
                                          {/* عرض الصلاحيات غير المفعلة */}
                                          {filePermissions.filter(perm => !currentFilePermissions.includes(perm.id)).map((permission) => {
                                            const IconComponent = permission.icon;
                                            
                                            return (
                                              <button
                                                key={permission.id}
                                                onClick={() => toggleFilePermission(user.id, file.id, permission.id)}
                                                className="p-2 rounded-lg border border-black/20 bg-white/50 text-black/50 text-xs flex items-center gap-1 hover:border-black/40 transition-colors"
                                              >
                                                <IconComponent className="w-3 h-3" />
                                                <span className="hidden md:inline">{permission.name}</span>
                                              </button>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-black/10">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-white/30 hover:bg-white/40 border border-black/20 rounded-full text-black font-medium transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={handleSavePermissions}
            className="px-6 py-3 bg-black hover:bg-black/90 rounded-full text-white font-medium transition-colors"
          >
            حفظ الصلاحيات
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
