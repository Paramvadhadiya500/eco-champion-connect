import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  FileText, 
  Award, 
  ClipboardList,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';

interface Complaint {
  id: string;
  userId: string;
  userName: string;
  photo: string;
  location: string;
  description: string;
  status: 'pending' | 'assigned' | 'resolved';
  assignedWorker?: string;
  createdAt: string;
}

interface Worker {
  id: string;
  name: string;
  phone: string;
  priceSteel: number;
  pricePlastic: number;
  pricePaper: number;
}

interface Report {
  id: string;
  userId: string;
  userName: string;
  complaintId: string;
  description: string;
  handled: boolean;
  createdAt: string;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [workers] = useState<Worker[]>([
    { id: '1', name: 'Raj Kumar', phone: '+91-9876543210', priceSteel: 45, pricePlastic: 20, pricePaper: 15 },
    { id: '2', name: 'Priya Sharma', phone: '+91-9876543211', priceSteel: 48, pricePlastic: 22, pricePaper: 16 },
    { id: '3', name: 'Amit Singh', phone: '+91-9876543212', priceSteel: 42, pricePlastic: 18, pricePaper: 14 },
    { id: '4', name: 'Sunita Devi', phone: '+91-9876543213', priceSteel: 50, pricePlastic: 25, pricePaper: 18 },
    { id: '5', name: 'Mohammed Ali', phone: '+91-9876543214', priceSteel: 46, pricePlastic: 21, pricePaper: 15 }
  ]);
  const [selectedWorker, setSelectedWorker] = useState<string>('');
  const [creditAmount, setCreditAmount] = useState<string>('');
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const complaintsData = JSON.parse(localStorage.getItem('complaints') || '[]');
    const reportsData = JSON.parse(localStorage.getItem('reports') || '[]');
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // Enrich complaints with user names
    const enrichedComplaints = complaintsData.map((complaint: Complaint) => {
      const user = users.find((u: any) => u.id === complaint.userId);
      return { ...complaint, userName: user?.name || 'Unknown User' };
    });

    // Enrich reports with user names
    const enrichedReports = reportsData.map((report: Report) => {
      const user = users.find((u: any) => u.id === report.userId);
      return { ...report, userName: user?.name || 'Unknown User' };
    });

    setComplaints(enrichedComplaints);
    setReports(enrichedReports);
  };

  const assignWorker = (complaintId: string) => {
    if (!selectedWorker) {
      toast({
        title: 'Error',
        description: 'Please select a worker',
        variant: 'destructive',
      });
      return;
    }

    const updatedComplaints = complaints.map(complaint => 
      complaint.id === complaintId 
        ? { ...complaint, status: 'assigned' as const, assignedWorker: selectedWorker }
        : complaint
    );

    setComplaints(updatedComplaints);
    localStorage.setItem('complaints', JSON.stringify(updatedComplaints));
    setSelectedWorker('');

    toast({
      title: 'Worker Assigned',
      description: 'Complaint has been assigned to a worker',
    });
  };

  const resolveComplaint = (complaintId: string) => {
    const updatedComplaints = complaints.map(complaint => 
      complaint.id === complaintId 
        ? { ...complaint, status: 'resolved' as const }
        : complaint
    );

    setComplaints(updatedComplaints);
    localStorage.setItem('complaints', JSON.stringify(updatedComplaints));

    // Award credits to user (10 credits for resolved complaint)
    const complaint = complaints.find(c => c.id === complaintId);
    if (complaint) {
      awardCredits(complaint.userId, 10);
    }

    toast({
      title: 'Complaint Resolved',
      description: 'Complaint marked as resolved and credits awarded to user',
    });
  };

  const awardCredits = (userId: string, credits: number) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === userId);
    
    if (userIndex !== -1) {
      users[userIndex].credits = (users[userIndex].credits || 0) + credits;
      localStorage.setItem('users', JSON.stringify(users));
    }
  };

  const handleReport = (reportId: string) => {
    const updatedReports = reports.map(report => 
      report.id === reportId 
        ? { ...report, handled: true }
        : report
    );

    setReports(updatedReports);
    localStorage.setItem('reports', JSON.stringify(updatedReports));

    toast({
      title: 'Report Handled',
      description: 'Report has been marked as handled',
    });
  };

  const addCreditsToUser = () => {
    if (!selectedUserId || !creditAmount) {
      toast({
        title: 'Error',
        description: 'Please select a user and enter credit amount',
        variant: 'destructive',
      });
      return;
    }

    awardCredits(selectedUserId, parseInt(creditAmount));
    setCreditAmount('');
    setSelectedUserId('');

    toast({
      title: 'Credits Added',
      description: `${creditAmount} credits added to user account`,
    });
  };

  const getGreenChampion = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.reduce((champion: any, user: any) => 
      (user.credits || 0) > (champion.credits || 0) ? user : champion, 
      { credits: 0, name: 'No users yet' }
    );
  };

  const greenChampion = getGreenChampion();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-warning text-warning-foreground';
      case 'assigned': return 'bg-primary text-primary-foreground';
      case 'resolved': return 'bg-success text-success-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Admin Dashboard 🛡️
        </h1>
        <p className="text-muted-foreground">
          Manage complaints, assign workers, and track system performance
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Complaints</p>
              <p className="text-2xl font-bold">{complaints.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="p-2 bg-warning/10 rounded-lg">
              <Clock className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold">
                {complaints.filter(c => c.status === 'pending').length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="p-2 bg-success/10 rounded-lg">
              <CheckCircle className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Resolved</p>
              <p className="text-2xl font-bold">
                {complaints.filter(c => c.status === 'resolved').length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="p-2 bg-destructive/10 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Reports</p>
              <p className="text-2xl font-bold">{reports.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Green Champion */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Green Champion 🏆
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Award className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold">{greenChampion.name}</h3>
              <p className="text-muted-foreground">{greenChampion.credits} credits earned</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Complaint Management */}
        <Card>
          <CardHeader>
            <CardTitle>Complaint Management</CardTitle>
            <CardDescription>Review and assign workers to complaints</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {complaints.map((complaint) => (
                <div key={complaint.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{complaint.location}</h4>
                      <p className="text-sm text-muted-foreground">by {complaint.userName}</p>
                    </div>
                    <Badge className={getStatusColor(complaint.status)}>
                      {complaint.status}
                    </Badge>
                  </div>
                  
                  <p className="text-sm">{complaint.description}</p>
                  
                  {complaint.status === 'pending' && (
                    <div className="space-y-3">
                      <Label>Assign Worker:</Label>
                      <RadioGroup value={selectedWorker} onValueChange={setSelectedWorker}>
                        {workers.map((worker) => (
                          <div key={worker.id} className="flex items-center space-x-2">
                            <RadioGroupItem value={worker.id} id={`worker-${worker.id}`} />
                            <Label htmlFor={`worker-${worker.id}`} className="text-sm">
                              {worker.name} - {worker.phone}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                      <Button 
                        onClick={() => assignWorker(complaint.id)}
                        size="sm"
                        className="w-full"
                      >
                        Assign Worker
                      </Button>
                    </div>
                  )}
                  
                  {complaint.status === 'assigned' && (
                    <Button 
                      onClick={() => resolveComplaint(complaint.id)}
                      size="sm"
                      variant="outline"
                      className="w-full"
                    >
                      Mark as Resolved
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reports & Credits */}
        <div className="space-y-6">
          {/* Report Management */}
          <Card>
            <CardHeader>
              <CardTitle>Report Management</CardTitle>
              <CardDescription>Handle user reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-48 overflow-y-auto">
                {reports.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No reports to handle
                  </p>
                ) : (
                  reports.map((report) => (
                    <div key={report.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{report.userName}</span>
                        <Badge variant={report.handled ? "default" : "destructive"}>
                          {report.handled ? "Handled" : "Pending"}
                        </Badge>
                      </div>
                      <p className="text-sm mb-2">{report.description}</p>
                      {!report.handled && (
                        <Button 
                          onClick={() => handleReport(report.id)}
                          size="sm"
                        >
                          Mark as Handled
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Credits Management */}
          <Card>
            <CardHeader>
              <CardTitle>Credits Management</CardTitle>
              <CardDescription>Award credits to users</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userId">User ID</Label>
                <Input
                  id="userId"
                  placeholder="Enter user ID"
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="credits">Credits Amount</Label>
                <Input
                  id="credits"
                  type="number"
                  placeholder="Enter credits to award"
                  value={creditAmount}
                  onChange={(e) => setCreditAmount(e.target.value)}
                />
              </div>
              <Button onClick={addCreditsToUser} className="w-full">
                Award Credits
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;