import React, { useEffect, useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardBody,
  Tabs, 
  Tab,
} from '@nextui-org/react';
import { BookOpen, Tag, Grid3x3, AlertCircle, Filter } from 'lucide-react';
import { apiService, Post, Category, Tag as TagType, extractErrorMessage } from '../services/apiService';
import PostList from '../components/PostList';

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<TagType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt,desc");
  const [selectedCategory, setSelectedCategory] = useState<string|undefined>(undefined);
  const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [postsResponse, categoriesResponse, tagsResponse] = await Promise.all([
          apiService.getPosts({      
            categoryId: selectedCategory != undefined ? selectedCategory : undefined,
            tagId: selectedTag || undefined
          }),
          apiService.getCategories(),
          apiService.getTags()
        ]);

        setPosts(postsResponse);
        setCategories(categoriesResponse);
        setTags(tagsResponse);
        setError(null);
      } catch (err) {
        setError(extractErrorMessage(err, 'Failed to load content. Please try again later.'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, sortBy, selectedCategory, selectedTag]);

  const handleCategoryChange = (categoryId: string|undefined) => {
    if("all" === categoryId){
      setSelectedCategory(undefined)
    } else {
      setSelectedCategory(categoryId);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 space-y-6">
      <Card className="mb-6 px-2">
        <CardHeader className="flex items-center gap-2">
          <BookOpen className="text-primary" size={24} />
          <h1 className="text-2xl font-bold">Blog Posts</h1>
        </CardHeader>
        <CardBody>
          <div className="flex flex-col gap-4">                     
            <Tabs 
              selectedKey={selectedCategory} 
              onSelectionChange={(key) => {
                handleCategoryChange(key as string)
              }}
              variant="underlined"
              classNames={{
                tabList: "gap-6",
                cursor: "w-full bg-primary",
              }}
            >
              <Tab 
                key="all" 
                title={
                  <div className="flex items-center gap-2">
                    <Grid3x3 size={16} />
                    <span>All Posts</span>
                  </div>
                }
              />
              {categories.map((category) => (
                <Tab 
                  key={category.id}
                  title={
                    <div className="flex items-center gap-2">
                      <BookOpen size={16} />
                      <span>{category.name} ({category.postCount})</span>
                    </div>
                  }
                />
              ))}
            </Tabs>

            {tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Filter size={16} className="text-default-500" />
                <span className="text-sm text-default-600">Filter by tags:</span>
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => setSelectedTag(selectedTag == tag.id ? undefined : tag.id)}
                    className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 transition-all ${
                      selectedTag === tag.id
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-default-100 hover:bg-default-200 text-default-700'
                    }`}
                  >
                    <Tag size={14} />
                    {tag.name} ({tag.postCount})
                  </button>
                ))}
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      <PostList
        posts={posts}
        loading={loading}
        error={error}
        page={page}
        sortBy={sortBy}
        onPageChange={setPage}
        onSortChange={setSortBy}
      />
    </div>
  );
};

export default HomePage;