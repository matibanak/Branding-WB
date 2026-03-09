import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Folder, Plus, ArrowRight, LayoutTemplate, Trash2, LogOut } from 'lucide-react';
import { collection, query, where, getDocs, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { BrandBrief, BrandPackage } from '../types';

interface SavedProject {
  id: string;
  userId: string;
  brief: BrandBrief;
  result: BrandPackage;
  createdAt: number;
}

interface ProjectsGalleryProps {
  onNewProject: () => void;
  onOpenProject: (brief: BrandBrief, result: BrandPackage) => void;
  onLogout: () => void;
}

export default function ProjectsGallery({ onNewProject, onOpenProject, onLogout }: ProjectsGalleryProps) {
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    async function fetchProjects() {
      if (!user) return;
      
      try {
        const q = query(
          collection(db, "projects"),
          where("userId", "==", user.uid)
        );
        
        const querySnapshot = await getDocs(q);
        let fetchedProjects: SavedProject[] = [];
        querySnapshot.forEach((doc) => {
          fetchedProjects.push({ id: doc.id, ...doc.data() } as SavedProject);
        });
        
        // Sort in client to avoid requiring a Firestore composite index
        fetchedProjects.sort((a, b) => b.createdAt - a.createdAt);
        
        setProjects(fetchedProjects);
      } catch (error: any) {
        console.error("Error fetching projects:", error);
        alert("Gallery Error: " + (error.message || JSON.stringify(error)));
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, [user]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('¿Estás seguro de que quieres eliminar esta marca?')) {
      try {
        await deleteDoc(doc(db, "projects", id));
        setProjects(projects.filter(p => p.id !== id));
      } catch (error) {
        console.error("Error deleting project:", error);
        alert("No se pudo eliminar el proyecto.");
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto w-full pb-20 text-left"
    >
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">Mis Marcas</h1>
          <p className="text-gray-500 mt-1">
            Hola, <span className="font-medium text-gray-900">{user?.displayName?.split(' ')[0] || 'creador'}</span>. Aquí están tus identidades generadas.
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={onLogout} 
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center shadow-sm"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </button>
          <button 
            onClick={onNewProject} 
            className="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors shadow-sm flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Marca
          </button>
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm flex flex-col items-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6">
            <LayoutTemplate className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-display font-bold mb-2">Aún no tienes marcas</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-8">
            Empieza tu primer proyecto dando clic en "Nueva Marca". Nuestra IA analizará tu brief y generará todo un sistema visual.
          </p>
          <button 
            onClick={onNewProject} 
            className="px-6 py-3 text-sm font-medium text-white bg-black rounded-xl hover:bg-gray-800 transition-colors shadow-md flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Crear mi primera Marca
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              whileHover={{ y: -4 }}
              onClick={() => onOpenProject(project.brief, project.result)}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm cursor-pointer group transition-all hover:shadow-md hover:border-gray-300"
            >
              <div 
                className="h-32 p-6 flex flex-col justify-center items-center relative overflow-hidden"
                style={{ backgroundColor: project.result.visual_identity.colors.background }}
              >
                <div 
                  className="w-3/4 max-w-[160px] max-h-[80px] [&_text]:!fill-current [&_path]:!stroke-current transition-transform group-hover:scale-105" 
                  style={{ color: project.result.visual_identity.colors.primary }}
                  dangerouslySetInnerHTML={{ __html: project.result.visual_identity.logos[0]?.svg_content || '' }} 
                />
              </div>
              <div className="p-5 flex justify-between items-start">
                <div>
                  <h3 className="font-display font-bold text-lg text-gray-900 group-hover:text-black line-clamp-1">{project.brief.businessName}</h3>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mt-1">{project.brief.industry || 'Proyecto Sin Categoría'}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'Hoy'}
                  </p>
                </div>
                <button 
                  onClick={(e) => handleDelete(project.id, e)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  title="Eliminar Proyecto"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
