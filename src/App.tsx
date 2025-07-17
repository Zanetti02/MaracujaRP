@@ .. @@
   if (loading) {
     return (
-      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 flex items-center justify-center">
+      <div className="min-h-screen bg-custom-gradient flex items-center justify-center">
         <div className="text-center">
-          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-400 mx-auto mb-4"></div>
+          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-custom-orange-500 mx-auto mb-4"></div>
           <p className="text-white text-lg">Caricamento paradiso tropicale...</p>
         </div>
       </div>
@@ .. @@
   if (error) {
     return (
-      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 flex items-center justify-center">
+      <div className="min-h-screen bg-custom-gradient flex items-center justify-center">
         <div className="text-center max-w-md mx-auto p-8">
           <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-6 mb-6">
             <h2 className="text-xl font-bold text-red-300 mb-2">Errore di Connessione</h2>
@@ .. @@
           <button
             onClick={fetchSections}
-            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg"
+            className="px-6 py-3 bg-orange-gradient text-white rounded-xl hover:bg-orange-gradient-reverse transition-all shadow-lg"
           >
             Riprova
           </button>
@@ .. @@
   if (isAdminMode && currentAdmin) {
     return (
-      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 text-white">
+      <div className="min-h-screen bg-custom-gradient text-white">
         <AdminDashboard 
           sections={sections}
           setSections={setSections}
@@ .. @@
   return (
-    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 text-white">
+    <div className="min-h-screen bg-custom-gradient text-white">
       <Header 
         searchTerm={searchTerm}
         setSearchTerm={setSearchTerm}