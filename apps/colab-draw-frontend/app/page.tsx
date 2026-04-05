import {
  Pencil,
  Users,
  Zap,
  Share2,
  Grid3x3,
  MousePointer2,
} from "lucide-react";
import { Footer } from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Pencil
              className="w-6 sm:w-7 h-6 sm:h-7 text-blue-600"
              strokeWidth={2.5}
            />
            <span className="text-xl sm:text-2xl font-bold text-slate-900">
              colab-draw
            </span>
          </div>
          <button className="px-4 sm:px-6 py-2 sm:py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm text-sm sm:text-base">
            Sign In
          </button>
        </div>
      </nav>

      <main className="flex-1">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-16 sm:pb-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-medium mb-6 sm:mb-8">
              <Zap className="w-4 h-4" />
              Collaborative whiteboarding made simple
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-4 sm:mb-6 leading-tight">
              Draw together,
              <br />
              <span className="text-blue-600">create together</span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-slate-600 mb-8 sm:mb-12 leading-relaxed max-w-2xl mx-auto">
              A real-time collaborative drawing board where teams can sketch
              ideas, brainstorm concepts, and bring visions to life together.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button className="px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                Start Drawing Now
              </button>
              <button className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors border-2 border-slate-200">
                View Demo
              </button>
            </div>
          </div>

          <div className="mt-12 sm:mt-20 bg-white rounded-2xl shadow-2xl p-4 sm:p-8 border border-slate-200 max-w-5xl mx-auto">
            <div className="aspect-video bg-gradient-to-br from-blue-50 to-slate-50 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-300">
              <div className="text-center">
                <Grid3x3 className="w-12 sm:w-16 h-12 sm:h-16 text-slate-400 mx-auto mb-3 sm:mb-4" />
                <p className="text-sm sm:text-base text-slate-500 font-medium">
                  Your collaborative canvas awaits
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-24 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">
                Everything you need to collaborate
              </h2>
              <p className="text-base sm:text-lg text-slate-600">
                Powerful features designed for seamless teamwork
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="p-6 sm:p-8 rounded-xl bg-gradient-to-br from-blue-50 to-white border border-blue-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-3">
                  Real-time Collaboration
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Work together instantly with your team. See everyone's changes
                  as they happen, no delays.
                </p>
              </div>

              <div className="p-6 sm:p-8 rounded-xl bg-gradient-to-br from-green-50 to-white border border-green-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                  <MousePointer2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-3">
                  Intuitive Drawing Tools
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Create rectangles, circles, lines, and freehand drawings with
                  an easy-to-use interface.
                </p>
              </div>

              <div className="p-6 sm:p-8 rounded-xl bg-gradient-to-br from-orange-50 to-white border border-orange-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-4">
                  <Share2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-3">
                  Easy Sharing
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Share your board with a simple link. No accounts required for
                  viewers to join.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 sm:mb-6">
              Ready to start creating?
            </h2>
            <p className="text-base sm:text-xl text-slate-600 mb-8 sm:mb-10">
              Join teams who are already collaborating visually with colab-draw
            </p>
            <button className="px-8 sm:px-10 py-3 sm:py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-base sm:text-lg">
              Launch Your Board
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;
