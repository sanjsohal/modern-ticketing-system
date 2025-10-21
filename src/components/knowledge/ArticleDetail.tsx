import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { formatDate, DateFormats } from '../../utils/dateUtils';
import { ChevronLeft, ThumbsUp, ThumbsDown, Clock } from 'lucide-react';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { Card, CardBody } from '../ui/Card';
import { knowledgeArticles } from '../../data/mockData';
import { users } from '../../data/mockData';

export const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const article = knowledgeArticles.find(a => a.id === id);
  
  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h2 className="text-xl font-medium text-gray-900 mb-4">Article Not Found</h2>
        <Link to="/knowledge">
          <Button variant="primary">Back to Knowledge Base</Button>
        </Link>
      </div>
    );
  }
  
  const author = users.find(user => user.id === article.author);
  
  // Convert markdown-like content to HTML
  const renderContent = (content: string) => {
    // Split content into paragraphs
    const paragraphs = content.split('\n\n');
    
    return (
      <div>
        {paragraphs.map((paragraph, index) => {
          // Check if it's a heading (starts with #)
          if (paragraph.startsWith('# ')) {
            return (
              <h1 key={index} className="text-2xl font-bold mb-4">
                {paragraph.substring(2)}
              </h1>
            );
          }
          
          // Check if it's a sub-heading (starts with ##)
          if (paragraph.startsWith('## ')) {
            return (
              <h2 key={index} className="text-xl font-semibold mb-3 mt-6">
                {paragraph.substring(3)}
              </h2>
            );
          }

          // Check if it's a list
          if (paragraph.includes('\n- ')) {
            const listItems = paragraph.split('\n- ');
            const title = listItems.shift();
            
            return (
              <div key={index} className="mb-4">
                {title && <p className="mb-2">{title}</p>}
                <ul className="list-disc pl-6 space-y-1">
                  {listItems.map((item, i) => (
                    <li key={i} className="text-gray-700">{item}</li>
                  ))}
                </ul>
              </div>
            );
          }
          
          // Regular paragraph
          return (
            <p key={index} className="mb-4 text-gray-700">
              {paragraph}
            </p>
          );
        })}
      </div>
    );
  };
  
  // Find related articles (same category)
  const relatedArticles = knowledgeArticles
    .filter(a => a.id !== article.id && a.category === article.category)
    .slice(0, 3);
  
  return (
    <div>
      <div className="mb-6">
        <Link 
          to="/knowledge" 
          className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Knowledge Base
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardBody className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{article.title}</h1>
              
              <div className="flex items-center text-sm text-gray-500 mb-6">
                <Clock className="h-4 w-4 mr-1" />
                Last updated {formatDate(article.updatedAt, DateFormats.LONG_DATE)}
                {author && (
                  <>
                    <span className="mx-2">•</span>
                    <div className="flex items-center">
                      <Avatar
                        src={author.avatar}
                        name={author.name}
                        size="xs"
                        className="mr-1"
                      />
                      {author.name}
                    </div>
                  </>
                )}
              </div>
              
              <div className="prose max-w-none">
                {renderContent(article.content)}
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-3">Was this article helpful?</p>
                <div className="flex space-x-4">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<ThumbsUp size={16} />}
                    onClick={() => alert('Thank you for your feedback!')}
                  >
                    Yes, it helped
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<ThumbsDown size={16} />}
                    onClick={() => navigate('/tickets/new')}
                  >
                    No, I need help
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
        
        <div>
          <div className="sticky top-24">
            <Card className="mb-6">
              <CardBody>
                <h3 className="font-medium text-gray-900 mb-3">In This Article</h3>
                <ul className="space-y-2 text-sm">
                  {article.content.split('\n').filter(line => line.startsWith('##')).map((heading, index) => (
                    <li key={index}>
                      <a href={`#${heading.substring(3).toLowerCase().replace(/\s+/g, '-')}`} className="text-indigo-600 hover:text-indigo-800">
                        {heading.substring(3)}
                      </a>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
            
            {relatedArticles.length > 0 && (
              <Card>
                <CardBody>
                  <h3 className="font-medium text-gray-900 mb-3">Related Articles</h3>
                  <ul className="space-y-3 text-sm">
                    {relatedArticles.map(relatedArticle => (
                      <li key={relatedArticle.id}>
                        <Link 
                          to={`/knowledge/${relatedArticle.id}`}
                          className="text-indigo-600 hover:text-indigo-800 flex"
                        >
                          <FileText className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                          {relatedArticle.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardBody>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};