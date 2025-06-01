import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Book, FileText } from 'lucide-react';
import { Card, CardBody } from '../ui/Card';
import { knowledgeArticles } from '../../data/mockData';

export const KnowledgeBase: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredArticles = knowledgeArticles.filter(
    article => 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Get unique categories
  const categories = Array.from(new Set(knowledgeArticles.map(article => article.category)));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Knowledge Base</h1>
        <p className="mt-1 text-sm text-gray-500">
          Find answers to common questions and helpful guides
        </p>
      </div>

      <div className="mb-8">
        <div className="max-w-3xl mx-auto relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Search the knowledge base..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {searchTerm ? (
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Search Results ({filteredArticles.length})
          </h2>

          {filteredArticles.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredArticles.map(article => (
                <Link key={article.id} to={`/knowledge/${article.id}`}>
                  <Card className="h-full transition-shadow hover:shadow-md">
                    <CardBody>
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <FileText className="h-6 w-6 text-indigo-500" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-base font-medium text-gray-900">
                            {article.title}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                            {article.content.replace(/[#*_]/g, '').slice(0, 100)}...
                          </p>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card>
              <CardBody className="text-center py-12">
                <Book className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No articles found
                </h3>
                <p className="text-gray-500">
                  Try using different keywords or browse by category
                </p>
              </CardBody>
            </Card>
          )}
        </div>
      ) : (
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Browse by Category</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map(category => {
              const categoryArticles = knowledgeArticles.filter(
                article => article.category === category
              );
              
              return (
                <Card key={category} className="h-full">
                  <CardBody>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">{category}</h3>
                    <ul className="space-y-3">
                      {categoryArticles.slice(0, 3).map(article => (
                        <li key={article.id}>
                          <Link 
                            to={`/knowledge/${article.id}`}
                            className="text-indigo-600 hover:text-indigo-800 text-sm flex items-start"
                          >
                            <FileText className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{article.title}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    {categoryArticles.length > 3 && (
                      <div className="mt-4 text-right">
                        <Link 
                          to={`/knowledge/category/${category}`}
                          className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                        >
                          View all ({categoryArticles.length})
                        </Link>
                      </div>
                    )}
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-12 bg-indigo-50 rounded-lg p-6 text-center">
        <h3 className="text-lg font-medium text-indigo-900 mb-2">
          Can't find what you're looking for?
        </h3>
        <p className="text-indigo-700 mb-4">
          Our support team is ready to help you with any questions you may have.
        </p>
        <Link to="/tickets/new">
          <Button>Create a Support Ticket</Button>
        </Link>
      </div>
    </div>
  );
};