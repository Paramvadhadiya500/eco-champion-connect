import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Upload, Camera, MapPin, FileText } from 'lucide-react';

const ComplaintForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    location: '',
    description: '',
    photo: null as File | null
  });
  const [photoPreview, setPhotoPreview] = useState<string>('');

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, photo: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.location || !formData.description) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // Simulate file upload and create complaint
      const complaint = {
        id: Date.now().toString(),
        userId: user?.id,
        userName: user?.name,
        photo: photoPreview || '/placeholder.svg', // In real app, this would be S3 URL
        location: formData.location,
        description: formData.description,
        status: 'pending' as const,
        createdAt: new Date().toISOString()
      };

      // Save to localStorage (simulate database)
      const complaints = JSON.parse(localStorage.getItem('complaints') || '[]');
      complaints.push(complaint);
      localStorage.setItem('complaints', JSON.stringify(complaints));

      toast({
        title: 'Complaint Submitted!',
        description: 'Your complaint has been submitted and will be reviewed by our team.',
      });

      navigate('/');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit complaint. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Submit Complaint 📋
        </h1>
        <p className="text-muted-foreground">
          Report waste management issues in your community
        </p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Waste Management Complaint
          </CardTitle>
          <CardDescription>
            Please provide details about the waste management issue you've encountered
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Photo Upload */}
            <div className="space-y-3">
              <Label htmlFor="photo">Upload Photo</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                {photoPreview ? (
                  <div className="space-y-3">
                    <img 
                      src={photoPreview} 
                      alt="Preview" 
                      className="max-w-full h-48 object-cover rounded-lg mx-auto"
                    />
                    <p className="text-sm text-muted-foreground">
                      Photo uploaded successfully
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Camera className="h-12 w-12 mx-auto text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Upload a photo of the waste issue</p>
                      <p className="text-xs text-muted-foreground">
                        JPG, PNG or WEBP (optional but recommended)
                      </p>
                    </div>
                  </div>
                )}
                <input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <Label
                  htmlFor="photo"
                  className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium cursor-pointer hover:bg-primary-hover transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  Choose Photo
                </Label>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location *
              </Label>
              <Input
                id="location"
                type="text"
                placeholder="e.g., Main Street near Bus Stop, Sector 15"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground">
                Please provide a specific location for the waste issue
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the waste management issue in detail..."
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground">
                Include details like type of waste, how long it's been there, impact on community, etc.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/')}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Submitting...' : 'Submit Complaint'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card className="mt-6 bg-accent/10">
        <CardContent className="pt-6">
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <Camera className="h-4 w-4 text-primary" />
            Tips for Better Complaints
          </h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Take clear photos showing the waste issue</li>
            <li>• Provide exact location details</li>
            <li>• Describe the type and quantity of waste</li>
            <li>• Mention any health or safety concerns</li>
            <li>• Include timing (how long the issue has existed)</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplaintForm;