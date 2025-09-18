import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, 
  Plus, 
  Users, 
  Award, 
  ClipboardList, 
  Coins,
  Play
} from 'lucide-react';

interface Complaint {
  id: string;
  userId: string;
  photo: string;
  location: string;
  description: string;
  status: 'pending' | 'assigned' | 'resolved';
  assignedWorker?: string;
  createdAt: string;
}

const Dashboard = () => {
  const { user, updateCredits, addRedeemCode } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [myComplaints, setMyComplaints] = useState<Complaint[]>([]);
  const [showAwarenessVideo, setShowAwarenessVideo] = useState(false);

  useEffect(() => {
    // Check if user has seen awareness video
    const seenVideo = localStorage.getItem(`awarenessVideo_${user?.id}`);
    if (!seenVideo) {
      setShowAwarenessVideo(true);
    }

    // Load user's complaints
    const complaints = JSON.parse(localStorage.getItem('complaints') || '[]');
    const userComplaints = complaints.filter((c: Complaint) => c.userId === user?.id);
    setMyComplaints(userComplaints);
  }, [user?.id]);

  const markVideoWatched = () => {
    localStorage.setItem(`awarenessVideo_${user?.id}`, 'true');
    setShowAwarenessVideo(false);
  };

  const generateRedeemCode = () => {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    addRedeemCode(code);
    updateCredits((user?.credits || 0) - 100);
    
    // Save redeem code
    const redeemCodes = JSON.parse(localStorage.getItem('redeemCodes') || '[]');
    redeemCodes.push({
      id: Date.now().toString(),
      userId: user?.id,
      code,
      createdAt: new Date().toISOString()
    });
    localStorage.setItem('redeemCodes', JSON.stringify(redeemCodes));

    toast({
      title: 'Redeem Code Generated!',
      description: `Your code: ${code}. Save this code for future use.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-warning text-warning-foreground';
      case 'assigned': return 'bg-primary text-primary-foreground';
      case 'resolved': return 'bg-success text-success-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      navigate('/admin');
    }
  }, [user?.role, navigate]);

  if (user?.role === 'admin') {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Awareness Video Modal */}
      {showAwarenessVideo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5 text-primary" />
                Welcome to EcoWaste!
              </CardTitle>
              <CardDescription>
                Watch this quick awareness video to learn about proper waste management
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted rounded-lg p-8 text-center">
                <Play className="h-16 w-16 mx-auto text-primary mb-4" />
                <p className="text-sm text-muted-foreground">
                  🌱 Proper waste segregation starts with you<br />
                  🚮 Report waste issues in your community<br />
                  ♻️ Earn credits for environmental contributions<br />
                  🏆 Become a Green Champion
                </p>
              </div>
              <Button onClick={markVideoWatched} className="w-full">
                I understand - Continue to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Dashboard Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Welcome back, {user?.name}! 🌿
        </h1>
        <p className="text-muted-foreground">
          Help keep your community clean by reporting waste issues
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">My Complaints</p>
              <p className="text-2xl font-bold">{myComplaints.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="p-2 bg-success/10 rounded-lg">
              <Award className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Credits Earned</p>
              <p className="text-2xl font-bold">{user?.credits || 0}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="p-2 bg-warning/10 rounded-lg">
              <ClipboardList className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Resolved</p>
              <p className="text-2xl font-bold">
                {myComplaints.filter(c => c.status === 'resolved').length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Coins className="h-6 w-6 text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Redeem Codes</p>
              <p className="text-2xl font-bold">{user?.redeemCodes?.length || 0}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Submit Complaint
            </CardTitle>
            <CardDescription>
              Report a waste management issue in your area
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/complaint">
              <Button className="w-full">Create New Complaint</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Worker Directory
            </CardTitle>
            <CardDescription>
              Connect with waste collection workers directly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/workers">
              <Button variant="outline" className="w-full">View Workers</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-primary" />
              Redeem Credits
            </CardTitle>
            <CardDescription>
              {(user?.credits || 0) >= 100 ? 'Generate redeem code' : `Need ${100 - (user?.credits || 0)} more credits`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={generateRedeemCode}
              disabled={(user?.credits || 0) < 100}
              className="w-full"
            >
              {(user?.credits || 0) >= 100 ? 'Generate Code' : 'Not Available'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Complaints */}
      <Card>
        <CardHeader>
          <CardTitle>My Recent Complaints</CardTitle>
          <CardDescription>
            Track the status of your submitted complaints
          </CardDescription>
        </CardHeader>
        <CardContent>
          {myComplaints.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No complaints submitted yet</p>
              <p className="text-sm">Start by creating your first complaint</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myComplaints.slice(0, 5).map((complaint) => (
                <div key={complaint.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{complaint.location}</h4>
                      <Badge className={getStatusColor(complaint.status)}>
                        {complaint.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {complaint.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;