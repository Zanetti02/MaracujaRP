import React from 'react';
import { Rule } from '../types';

interface RuleCardProps {
  rule: Rule;
  index?: number;
  searchTerm?: string;
}

const highlightText = (text: string, searchTerm: string) => {
  if (!searchTerm) return text;
  
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark class="bg-custom-orange-400/40 text-custom-orange-100 px-1 rounded">$1</mark>');
};

const RuleCard: React.FC<RuleCardProps> = ({ rule, index, searchTerm = '' }) => {
  return (
    <div className="bg-gradient-to-r from-custom-cyan-800/40 to-custom-cyan-700/40 backdrop-blur-sm rounded-xl border border-custom-cyan-400/30 p-6 hover:border-custom-orange-400/50 transition-all duration-200 hover:shadow-lg hover:shadow-custom-orange-500/20 group">
      <div className="flex items-start space-x-4">
        {index && (
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-orange-gradient rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <span className="text-white text-sm font-bold">{index}</span>
            </div>
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <h4 className="text-lg font-semibold text-white mb-3 group-hover:text-custom-orange-200 transition-colors">
            {searchTerm 
              ? <span dangerouslySetInnerHTML={{ __html: highlightText(rule.title, searchTerm) }} />
              : rule.title
            }
          </h4>
          <div 
            className="text-custom-cyan-100 leading-relaxed prose prose-invert prose-sm max-w-none"
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