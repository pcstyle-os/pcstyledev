import { SmoothBackground } from "@/components/SmoothBackground";
import { Hero } from "@/components/Hero";
import { ProjectsSection } from "@/components/ProjectsSection";
import { ScrollIndicator } from "@/components/ScrollIndicator";

// lepsze SEO przez semantic HTML i dodatkowy content
export default function Home() {
  return (
    <>
      <h1 className="sr-only">
        Adam Krupa — Developer z Polski | pcstyle.dev Portfolio | AI Developer & Creative Coder
      </h1>
      <main className="relative isolate mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-24 px-6 pb-40 pt-16 sm:px-10 lg:px-16">
        <SmoothBackground />
        <ScrollIndicator />
        {/* intro ma robić pop i robi pop */}
        <Hero />
        <ProjectsSection />
        
        {/* dodatkowy content dla SEO — niewidoczny ale indeksowany */}
        <section className="sr-only" aria-hidden="true">
          <h2>Adam Krupa — Developer z Polski | pcstyle.dev</h2>
          <p>
            Adam Krupa, znany jako pcstyle, to 18-letni developer z Polski, student Sztucznej Inteligencji 
            na Politechnice Częstochowskiej w Częstochowie. Adam Krupa developer specjalizuje się w web development, 
            AI development i creative coding. Tworzy neo-brutalistyczne projekty 
            łączące technologię, design i sztukę. Adam Krupa Poland — portfolio programisty i kreatywnego kodera.
          </p>
          
          <h3>Kim jest Adam Krupa?</h3>
          <p>
            Adam Krupa to młody developer z Częstochowy, student pierwszego roku Sztucznej Inteligencji 
            na Politechnice Częstochowskiej. Jako pcstyle tworzy innowacyjne projekty webowe i aplikacje AI.
            Adam Krupa developer Poland łączy technologię z kreatywnością, specjalizując się w React, Next.js, 
            TypeScript i Framer Motion. Portfolio Adam Krupa zawiera projekty takie jak Clock Gallery, AimDrift, 
            PoliCalc i PixelForge.
          </p>
          
          <h3>Projekty Adam Krupa (pcstyle)</h3>
          <ul>
            <li>
              <strong>Clock Gallery</strong> - Kreatywna galeria animowanych zegarów z efektami doodle, mycelium, 
              particle clouds i neon. Projekt Adam Krupa demonstrujący creative coding i interactive design.
            </li>
            <li>
              <strong>AimDrift</strong> - Interaktywny trener precyzji i celowania z multiple modes i evolving visual styles. 
              Game development project Adam Krupa Poland.
            </li>
            <li>
              <strong>PoliCalc</strong> - Kalkulator ocen dla Politechniki Częstochowskiej (open source). 
              Narzędzie dla studentów PCz stworzone przez Adam Krupa developer.
            </li>
            <li>
              <strong>PixelForge</strong> - AI-powered image studio z point-and-edit i style transfer. 
              AI project Adam Krupa wykorzystujący machine learning.
            </li>
          </ul>
          
          <h3>Adam Krupa Developer — Technologie i Umiejętności</h3>
          <p>
            Adam Krupa developer z Polski specjalizuje się w nowoczesnych technologiach webowych i AI:
          </p>
          <ul>
            <li><strong>Frontend Development:</strong> React, Next.js, TypeScript, Framer Motion, Tailwind CSS</li>
            <li><strong>AI & Machine Learning:</strong> Artificial Intelligence, Machine Learning, Python</li>
            <li><strong>Design:</strong> Neo Brutalism, Interactive Design, Generative Art, Creative Coding</li>
            <li><strong>Tools:</strong> Git, Cursor IDE, Vercel, Modern Web Technologies</li>
          </ul>
          <p>
            Adam Krupa Poland portfolio pokazuje szeroki zakres umiejętności od web development przez AI 
            po creative coding. Portfolio Adam Krupa developer prezentuje projekty łączące estetykę 
            neo-brutalistyczną z zaawansowanymi funkcjonalnościami.
          </p>
          
          <h3>Lokalizacja - Developer Częstochowa</h3>
          <p>
            Adam Krupa developer znajduje się w Częstochowie, Polska (województwo śląskie). 
            Web developer Częstochowa, AI developer Częstochowa, programista Częstochowa.
            Student Politechniki Częstochowskiej kierunek Sztuczna Inteligencja.
          </p>
          
          <h3>O Adam Krupa (FAQ)</h3>
          <dl>
            <dt>Szukasz "Adam Krupa developer"?</dt>
            <dd>
              Adam Krupa (pcstyle) to młody programista z Polski, specjalizujący się w 
              web development i AI. Portfolio dostępne na pcstyle.dev.
            </dd>
            
            <dt>Gdzie studiuje Adam Krupa?</dt>
            <dd>
              Adam Krupa studiuje Sztuczną Inteligencję na Politechnice Częstochowskiej (PCz) w Częstochowie, Polska.
            </dd>
            
            <dt>Jakie projekty stworzył Adam Krupa developer?</dt>
            <dd>
              Adam Krupa stworzył projekty takie jak Clock Gallery (galeria zegarów), AimDrift (aim trainer), 
              PoliCalc (kalkulator dla PCz) i PixelForge (AI image studio).
            </dd>
            
            <dt>W jakich technologiach specjalizuje się Adam Krupa?</dt>
            <dd>
              Adam Krupa Poland specjalizuje się w React, Next.js, TypeScript, Framer Motion, AI/ML, 
              oraz creative coding i neo-brutalistycznym designie.
            </dd>
            
            <dt>Adam Krupa developer Poland - kontakt?</dt>
            <dd>
              Adam Krupa kontakt: email adamkrupa@tuta.io, GitHub @pcstyle, portfolio pcstyle.dev
            </dd>
          </dl>
          
          <h3>Keywords: Adam Krupa</h3>
          <p>
            Adam Krupa, Adam Krupa developer, Adam Krupa Poland, Adam Krupa developer Poland, 
            Adam Krupa portfolio, Adam Krupa Częstochowa, Adam Krupa Politechnika Częstochowska,
            Adam Krupa web developer, Adam Krupa AI developer, Adam Krupa pcstyle, pcstyle Adam Krupa,
            developer Częstochowa, programista Częstochowa, web developer Polska, AI developer Polska,
            student AI Polska, portfolio developer Poland, młody developer Polska, React developer Poland,
            Next.js developer Poland, TypeScript developer Poland, creative coder Poland
          </p>
        </section>
      </main>
      
      {/* structured data - FAQPage schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Kim jest Adam Krupa developer?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Adam Krupa (pcstyle) to 18-letni developer z Polski, student Sztucznej Inteligencji na Politechnice Częstochowskiej. Specjalizuje się w web development, AI development i creative coding, tworząc neo-brutalistyczne projekty."
                }
              },
              {
                "@type": "Question",
                name: "Gdzie studiuje Adam Krupa?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Adam Krupa studiuje na kierunku Sztuczna Inteligencja na Politechnice Częstochowskiej (PCz) w Częstochowie, Polska."
                }
              },
              {
                "@type": "Question",
                name: "Jakie projekty stworzył Adam Krupa?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Adam Krupa stworzył projekty: Clock Gallery (galeria animowanych zegarów), AimDrift (interaktywny aim trainer), PoliCalc (kalkulator ocen dla PCz), PixelForge (AI-powered image studio)."
                }
              },
              {
                "@type": "Question",
                name: "W jakich technologiach specjalizuje się Adam Krupa developer?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Adam Krupa specjalizuje się w React, Next.js, TypeScript, Framer Motion, Tailwind CSS, Artificial Intelligence, Machine Learning, oraz creative coding i neo-brutalistycznym designie."
                }
              },
              {
                "@type": "Question",
                name: "Jak skontaktować się z Adam Krupa developer Poland?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Kontakt z Adam Krupa: email adamkrupa@tuta.io, GitHub github.com/pcstyle, portfolio pcstyle.dev, Facebook, Discord @pcstyle"
                }
              }
            ]
          }),
        }}
      />
      
      {/* structured data dla projektów */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "pcstyle Projects by Adam Krupa — Developer z Polski",
            itemListElement: [
              {
                "@type": "CreativeWork",
                position: 1,
                name: "Clock Gallery",
                url: "https://clock.pcstyle.dev",
                description: "Creative gallery of animated clocks by Adam Krupa (pcstyle) — Developer z Polski",
                author: { 
                  "@type": "Person", 
                  name: "Adam Krupa",
                  alternateName: "pcstyle",
                  nationality: { "@type": "Country", name: "Poland" }
                },
              },
              {
                "@type": "CreativeWork",
                position: 2,
                name: "AimDrift",
                url: "https://driftfield.pcstyle.dev",
                description: "Interactive aim trainer by Adam Krupa (pcstyle) — Developer z Polski",
                author: { 
                  "@type": "Person", 
                  name: "Adam Krupa",
                  alternateName: "pcstyle",
                  nationality: { "@type": "Country", name: "Poland" }
                },
              },
              {
                "@type": "SoftwareApplication",
                position: 3,
                name: "PoliCalc",
                url: "https://kalkulator.pcstyle.dev",
                description: "Grade calculator for Politechnika Częstochowska by Adam Krupa (pcstyle) — Developer z Polski",
                author: { 
                  "@type": "Person", 
                  name: "Adam Krupa",
                  alternateName: "pcstyle",
                  nationality: { "@type": "Country", name: "Poland" }
                },
                applicationCategory: "UtilityApplication",
              },
              {
                "@type": "SoftwareApplication",
                position: 4,
                name: "PixelForge",
                url: "https://pixlab.pcstyle.dev",
                description: "AI-powered image studio by Adam Krupa (pcstyle) — Developer z Polski",
                author: { 
                  "@type": "Person", 
                  name: "Adam Krupa",
                  alternateName: "pcstyle",
                  nationality: { "@type": "Country", name: "Poland" }
                },
                applicationCategory: "MultimediaApplication",
              },
            ],
          }),
        }}
      />
    </>
  );
}
