
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Image, 
  Upload, 
  Download, 
  Palette, 
  Type,
  Layers,
  Sparkles,
  Play,
  Eye
} from "lucide-react";

export const ImageBranding = () => {
  const brandTemplates = [
    {
      id: 1,
      name: "Social Media Post",
      size: "1080x1080",
      platform: "Instagram",
      preview: "/placeholder.svg",
      status: "active"
    },
    {
      id: 2,
      name: "Blog Header",
      size: "1200x630",
      platform: "Website",
      preview: "/placeholder.svg",
      status: "draft"
    },
    {
      id: 3,
      name: "LinkedIn Banner",
      size: "1584x396",
      platform: "LinkedIn",
      preview: "/placeholder.svg",
      status: "active"
    }
  ];

  const overlayElements = [
    { type: "Logo", position: "top-right", opacity: 85 },
    { type: "Text", content: "MarketingHub", font: "Inter Bold" },
    { type: "Gradient", style: "Purple to Blue", blend: "overlay" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Image Branding</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Create and manage branded visual content</p>
        </div>
        <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700">
          <Upload className="h-4 w-4 mr-2" />
          Upload Template
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template Gallery */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Brand Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {brandTemplates.map((template) => (
              <Card key={template.id} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-gray-900 dark:text-gray-100">{template.name}</CardTitle>
                      <CardDescription className="text-sm text-gray-600 dark:text-gray-400">{template.size} • {template.platform}</CardDescription>
                    </div>
                    <Badge className={template.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}>
                      {template.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/50 dark:to-purple-900/50 rounded-lg mb-4 flex items-center justify-center">
                    <Image className="h-12 w-12 text-violet-400" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button size="sm" className="bg-violet-600 hover:bg-violet-700">
                      <Play className="h-4 w-4 mr-2" />
                      Generate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Overlay Controls */}
        <div className="space-y-6">
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
                <Layers className="h-5 w-5" />
                <span>Overlay Elements</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {overlayElements.map((element, index) => (
                <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900 dark:text-gray-100">{element.type}</span>
                    <Button variant="ghost" size="sm">
                      <Palette className="h-3 w-3" />
                    </Button>
                  </div>
                  {element.content && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">{element.content}</p>
                  )}
                  {element.position && (
                    <p className="text-xs text-gray-500 dark:text-gray-500">Position: {element.position}</p>
                  )}
                </div>
              ))}
              <Button className="w-full bg-gradient-to-r from-purple-600 to-violet-600">
                <Sparkles className="h-4 w-4 mr-2" />
                Apply Branding
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
                <Type className="h-5 w-5" />
                <span>Typography</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Primary Font</label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                  <option>Inter</option>
                  <option>Satoshi</option>
                  <option>Plus Jakarta Sans</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Brand Colors</label>
                <div className="flex space-x-2">
                  <div className="w-8 h-8 bg-violet-600 rounded-lg"></div>
                  <div className="w-8 h-8 bg-purple-600 rounded-lg"></div>
                  <div className="w-8 h-8 bg-indigo-600 rounded-lg"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
