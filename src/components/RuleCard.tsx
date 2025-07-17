@@ .. @@
   return (
   )
-    <div className="bg-gradient-to-r from-teal-800/40 to-emerald-800/40 backdrop-blur-sm rounded-xl border border-teal-400/30 p-6 hover:border-orange-400/50 transition-all duration-200 hover:shadow-lg hover:shadow-orange-500/20 group">
+    <div className="bg-gradient-to-r from-custom-cyan-800/40 to-custom-cyan-700/40 backdrop-blur-sm rounded-xl border border-custom-cyan-400/30 p-6 hover:border-custom-orange-400/50 transition-all duration-200 hover:shadow-lg hover:shadow-custom-orange-500/20 group">
       <div className="flex items-start space-x-4">
         {index && (
           <div className="flex-shrink-0">
-            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
+            <div className="w-8 h-8 bg-orange-gradient rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
               <span className="text-white text-sm font-bold">{index}</span>
             </div>
           </div>
@@ .. @@
           <div 
)
}
-            className="text-teal-100 leading-relaxed prose prose-invert prose-sm max-w-none"
+            className="text-custom-cyan-100 leading-relaxed prose prose-invert prose-sm max-w-none"
             dangerouslySetInnerHTML={{ 
               __html: searchTerm 
                 ? highlightText(rule.content, searchTerm).toString()
             }
             }