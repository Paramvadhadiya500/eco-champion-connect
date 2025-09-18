import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Phone, User, DollarSign, Search } from 'lucide-react';

interface Worker {
  id: string;
  name: string;
  phone: string;
  priceSteel: number;
  pricePlastic: number;
  pricePaper: number;
  rating: number;
  completedJobs: number;
}

const WorkerDirectory = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [workers] = useState<Worker[]>([
    {
      id: '1',
      name: 'Raj Kumar',
      phone: '+91-9876543210',
      priceSteel: 45,
      pricePlastic: 20,
      pricePaper: 15,
      rating: 4.8,
      completedJobs: 245
    },
    {
      id: '2',
      name: 'Priya Sharma',
      phone: '+91-9876543211',
      priceSteel: 48,
      pricePlastic: 22,
      pricePaper: 16,
      rating: 4.9,
      completedJobs: 189
    },
    {
      id: '3',
      name: 'Amit Singh',
      phone: '+91-9876543212',
      priceSteel: 42,
      pricePlastic: 18,
      pricePaper: 14,
      rating: 4.7,
      completedJobs: 156
    },
    {
      id: '4',
      name: 'Sunita Devi',
      phone: '+91-9876543213',
      priceSteel: 50,
      pricePlastic: 25,
      pricePaper: 18,
      rating: 4.9,
      completedJobs: 298
    },
    {
      id: '5',
      name: 'Mohammed Ali',
      phone: '+91-9876543214',
      priceSteel: 46,
      pricePlastic: 21,
      pricePaper: 15,
      rating: 4.6,
      completedJobs: 134
    }
  ]);

  const filteredWorkers = workers.filter(worker =>
    worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.phone.includes(searchTerm)
  );

  const handleContact = (worker: Worker) => {
    toast({
      title: 'Contact Information',
      description: `Call ${worker.name} at ${worker.phone}`,
    });
    // In a real app, this might open the phone dialer
    window.open(`tel:${worker.phone}`);
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.8) return 'text-success';
    if (rating >= 4.5) return 'text-primary';
    if (rating >= 4.0) return 'text-warning';
    return 'text-muted-foreground';
  };

  const getBestPrice = (prices: number[]) => {
    return Math.min(...prices);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Worker Directory 👷‍♂️
        </h1>
        <p className="text-muted-foreground">
          Connect directly with waste collection workers in your area
        </p>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search workers by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Pricing Information */}
      <Card className="mb-6 bg-accent/10">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Current Market Rates (per kg)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-card rounded-lg">
              <div className="text-2xl font-bold text-primary">₹{getBestPrice(workers.map(w => w.priceSteel))}</div>
              <div className="text-sm text-muted-foreground">Steel (Best)</div>
            </div>
            <div className="p-3 bg-card rounded-lg">
              <div className="text-2xl font-bold text-primary">₹{getBestPrice(workers.map(w => w.pricePlastic))}</div>
              <div className="text-sm text-muted-foreground">Plastic (Best)</div>
            </div>
            <div className="p-3 bg-card rounded-lg">
              <div className="text-2xl font-bold text-primary">₹{getBestPrice(workers.map(w => w.pricePaper))}</div>
              <div className="text-sm text-muted-foreground">Paper (Best)</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorkers.map((worker) => (
          <Card key={worker.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5 text-primary" />
                  {worker.name}
                </CardTitle>
                <div className="text-right">
                  <div className={`text-lg font-bold ${getRatingColor(worker.rating)}`}>
                    ⭐ {worker.rating}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {worker.completedJobs} jobs
                  </div>
                </div>
              </div>
              <CardDescription className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {worker.phone}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Pricing */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Category-wise Pricing (₹/kg)</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <span className="text-sm">Steel</span>
                    <Badge variant="outline">₹{worker.priceSteel}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <span className="text-sm">Plastic</span>
                    <Badge variant="outline">₹{worker.pricePlastic}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <span className="text-sm">Paper</span>
                    <Badge variant="outline">₹{worker.pricePaper}</Badge>
                  </div>
                </div>
              </div>

              {/* Contact Button */}
              <Button 
                onClick={() => handleContact(worker)}
                className="w-full"
              >
                <Phone className="h-4 w-4 mr-2" />
                Contact {worker.name}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredWorkers.length === 0 && (
        <Card className="text-center py-8">
          <CardContent>
            <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">No workers found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria
            </p>
          </CardContent>
        </Card>
      )}

      {/* Information */}
      <Card className="mt-8 bg-accent/10">
        <CardHeader>
          <CardTitle className="text-lg">How to Use Worker Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• Compare prices across different workers for best rates</li>
            <li>• Check ratings and completed jobs for reliability</li>
            <li>• Contact workers directly to negotiate and schedule pickup</li>
            <li>• Segregate your waste properly before pickup</li>
            <li>• Have your waste weighed for accurate payment</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkerDirectory;