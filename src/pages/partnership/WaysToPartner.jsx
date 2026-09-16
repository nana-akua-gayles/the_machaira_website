import React from 'react';
import { HandCoins, HeartHandshake, Sprout, ArrowRight } from 'lucide-react';

export default function WaysToPartner() {
  return (
    <div>
      {/* WAYS TO PARTNER SECTION */}
      <section className="px-15 py-12 flex flex-col items-center">
        <span className="text-burgundy-primary text-2xl font-bold tracking-wider mb-1.5 text-center">
          WE ARE MORE THAN A MINISTRY, WE ARE A MOVEMENT.
        </span>
        <p className="text-cool-gray text-sm text-center max-w-125 mb-8">
          We are on a mission to storm and flood cities with Christ. <br />
          When you partner with us, you are helping to raise a generation of leaders who 
          will impact their communities and the world for Christ.
        </p>

        <div className="flex flex-col md:flex-row justify-between w-full gap-5">
          {/* Give Card */}
          <div className="flex-1 bg-parchment rounded-xl p-6 border border-soft-gray/40 flex items-start gap-4 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-burgundy-primary flex justify-center items-center shrink-0 shadow-sm transition-transform duration-300 hover:scale-105">
              <HandCoins className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col justify-between h-full">
              <div>
                <h3 className="text-lg font-bold text-charcoal-text mb-1">Give</h3>
                <p className="text-cool-gray text-xs leading-relaxed mb-4">
                  Every word written is a seed sown into a soul. Your 
                  giving puts the word into the hands of thousands who may never meet us, 
                  but will meet God through it.
                </p>
              </div>
              <button className="flex items-center gap-1.5 text-burgundy-primary font-semibold text-xs hover:opacity-80 transition-opacity group w-fit">
                Give Now <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Serve Card */}
          <div className="flex-1 bg-parchment rounded-xl p-6 border border-soft-gray/40 flex items-start gap-4 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-burgundy-primary flex justify-center items-center shrink-0 shadow-sm transition-transform duration-300 hover:scale-105">
              <HeartHandshake className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col justify-between h-full">
              <div>
                <h3 className="text-lg font-bold text-charcoal-text mb-1">Serve</h3>
                <p className="text-cool-gray text-xs leading-relaxed mb-4">
                  Outpouring needs hands, not just hearts. Lend your time, 
                  your voice, your platform and help us carry this Gospel of our Lord to the nations!
                </p>
              </div>
              <button className="flex items-center gap-1.5 text-burgundy-primary font-semibold text-xs hover:opacity-80 transition-opacity group w-fit">
                Explore Opportunities <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Connect Card */}
          <div className="flex-1 bg-parchment rounded-xl p-6 border border-soft-gray/40 flex items-start gap-4 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-burgundy-primary flex justify-center items-center shrink-0 shadow-sm transition-transform duration-300 hover:scale-105">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col justify-between h-full">
              <div>
                <h3 className="text-lg font-bold text-charcoal-text mb-1">Grow</h3>
                <p className="text-cool-gray text-xs leading-relaxed mb-4">
                  This is more than a book you read, it's a life that reads you. Let what you read 
                  disciple you, stretch you, and build you day by day, until your life becomes the message.
                </p>
              </div>
              <button className="flex items-center gap-1.5 text-burgundy-primary font-semibold text-xs hover:opacity-80 transition-opacity group w-fit">
                Be transformed <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}