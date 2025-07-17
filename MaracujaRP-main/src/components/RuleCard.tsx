import React from 'react';
import { Rule } from '../types';

interface RuleCardProps {
  rule: Rule;
  index?: number;
  searchTerm?: string;
}

const RuleCard: React.FC<RuleCardProps> = ({ rule, index, searchTerm }) => {
  const highlightText = (text: string, term: string) => {
    if (!term) return text;
    
    const regex = new RegExp(`(${term})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, i) => 
      regex.test(part) ? (
        <mark key={i} className="bg-yellow-400/40 text-yellow-100 rounded px-1">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="bg-gradient-to-r from-teal-800/40 to-emerald-800/40 backdrop-blur-sm rounded-xl border border-teal-400/30 p-6 hover:border-orange-400/50 transition-all duration-200 hover:shadow-lg hover:shadow-orange-500/20 group">
      <div className="flex items-start space-x-4">
        {index && (
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <span className="text-white text-sm font-bold">{index}</span>
            </div>
          </div>
        )}
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-3">
            {highlightText(rule.title, searchTerm || '')}
          </h3>
          <div 
            className="text-teal-100 leading-relaxed prose prose-invert prose-sm max-w-none"
            dangerouslySetInnerHTML={{ 
              __html: searchTerm 
                ? highlightText(rule.content, searchTerm).toString()
                : rule.content 
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default RuleCard;