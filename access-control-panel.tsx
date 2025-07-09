"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import {
  ChevronLeft,
  ChevronRight,
  Info,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  Plus,
  Upload,
  Globe,
  Shield,
  Key,
  Mail,
  Users,
  Lock,
  MapPin,
} from "lucide-react"

interface GuestLink {
  id: string
  name: string
  expiresIn: string
  scope: string
  created: string
  status: "active" | "expired"
}

const accessControlOptions = [
  {
    id: "none",
    label: "None (Public – no gate)",
    description: "No access restrictions. Anyone can view the environment.",
    icon: Globe,
  },
  {
    id: "password",
    label: "Password",
    description: "Simple password protection for basic access control.",
    icon: Lock,
  },
  {
    id: "contentstack",
    label: "Contentstack Login",
    description: "Uses existing Contentstack user sessions and role permissions.",
    icon: Shield,
  },
  {
    id: "sso",
    label: "Enterprise SSO (SAML/OIDC)",
    description: "Single sign-on integration with your identity provider.",
    icon: Key,
  },
  {
    id: "email",
    label: "Email Whitelist (magic-link)",
    description: "Allow specific email addresses or domains via magic links.",
    icon: Mail,
  },
  {
    id: "ip",
    label: "IP Allow-list",
    description: "Restrict access based on IP addresses or CIDR ranges.",
    icon: Shield,
  },
  {
    id: "guest",
    label: "Guest Invitation Links",
    description: "Create temporary invitation links with specific permissions.",
    icon: Users,
  },
  {
    id: "geo",
    label: "Geo/Time Restriction",
    description: "Limit access by geographic location and time windows.",
    icon: MapPin,
  },
]

const countries = [
  "United States",
  "Canada",
  "United Kingdom",
  "Germany",
  "France",
  "Japan",
  "Australia",
  "India",
  "Brazil",
  "Mexico",
]

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export default function AccessControlPanel() {
  const [selectedOption, setSelectedOption] = useState("none")
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState("")
  const [isBlockMode, setIsBlockMode] = useState(false)
  const [selectedCountries, setSelectedCountries] = useState<string[]>([])
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [guestLinks, setGuestLinks] = useState<GuestLink[]>([
    {
      id: "1",
      name: "Client Review Link",
      expiresIn: "7 days",
      scope: "view",
      created: "2024-01-15",
      status: "active",
    },
    {
      id: "2",
      name: "Stakeholder Access",
      expiresIn: "30 days",
      scope: "comment",
      created: "2024-01-10",
      status: "active",
    },
  ])
  const [isCreateLinkOpen, setIsCreateLinkOpen] = useState(false)
  const [newLinkName, setNewLinkName] = useState("")
  const [newLinkExpiry, setNewLinkExpiry] = useState("")
  const [newLinkScope, setNewLinkScope] = useState("")

  const getPasswordStrength = (pwd: string) => {
    if (pwd.length === 0) return { strength: 0, label: "" }
    if (pwd.length < 6) return { strength: 1, label: "Weak" }
    if (pwd.length < 10) return { strength: 2, label: "Medium" }
    if (pwd.length >= 10 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)) {
      return { strength: 4, label: "Very Strong" }
    }
    return { strength: 3, label: "Strong" }
  }

  const passwordStrength = getPasswordStrength(password)

  const handleCountryToggle = (country: string) => {
    setSelectedCountries((prev) => (prev.includes(country) ? prev.filter((c) => c !== country) : [...prev, country]))
  }

  const handleDayToggle = (day: string) => {
    setSelectedDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]))
  }

  const createGuestLink = () => {
    if (newLinkName && newLinkExpiry && newLinkScope) {
      const newLink: GuestLink = {
        id: Date.now().toString(),
        name: newLinkName,
        expiresIn: newLinkExpiry,
        scope: newLinkScope,
        created: new Date().toISOString().split("T")[0],
        status: "active",
      }
      setGuestLinks([...guestLinks, newLink])
      setNewLinkName("")
      setNewLinkExpiry("")
      setNewLinkScope("")
      setIsCreateLinkOpen(false)
    }
  }

  const copyLink = (linkId: string) => {
    navigator.clipboard.writeText(`https://launch.contentstack.com/invite/${linkId}`)
  }

  const revokeLink = (linkId: string) => {
    setGuestLinks(guestLinks.filter((link) => link.id !== linkId))
  }

  const renderConfigurationForm = () => {
    switch (selectedOption) {
      case "password":
        return (
          <Card className="mt-4">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {password && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              passwordStrength.strength === 1
                                ? "bg-red-500 w-1/4"
                                : passwordStrength.strength === 2
                                  ? "bg-yellow-500 w-2/4"
                                  : passwordStrength.strength === 3
                                    ? "bg-blue-500 w-3/4"
                                    : passwordStrength.strength === 4
                                      ? "bg-green-500 w-full"
                                      : "w-0"
                            }`}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{passwordStrength.label}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case "contentstack":
        return (
          <Card className="mt-4">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-lg">
                <Info className="h-4 w-4 text-blue-600" />
                <p className="text-sm text-blue-800">
                  Uses existing Contentstack session and role permissions. No additional configuration required.
                </p>
              </div>
            </CardContent>
          </Card>
        )

      case "sso":
        return (
          <Card className="mt-4">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>IdP Metadata</Label>
                  <div className="flex gap-2">
                    <Input placeholder="Metadata URL" className="flex-1" />
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload XML
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="entity-id">Entity ID / Audience URI</Label>
                  <Input id="entity-id" placeholder="https://your-app.contentstack.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role-mapping">Role/Group Claim Mapping</Label>
                  <Textarea
                    id="role-mapping"
                    placeholder="admin:Administrator&#10;editor:Editor&#10;viewer:Viewer"
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case "email":
        return (
          <Card className="mt-4">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-whitelist">Allowed Emails/Domains</Label>
                  <Textarea
                    id="email-whitelist"
                    placeholder="user@company.com&#10;@company.com&#10;admin@example.org"
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="link-expiry">Magic Link Expiry</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select expiry time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1h">1 hour</SelectItem>
                      <SelectItem value="6h">6 hours</SelectItem>
                      <SelectItem value="24h">24 hours</SelectItem>
                      <SelectItem value="7d">7 days</SelectItem>
                      <SelectItem value="30d">30 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case "ip":
        return (
          <Card className="mt-4">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ip-ranges">IP Addresses / CIDR Ranges</Label>
                  <Textarea id="ip-ranges" placeholder="192.168.1.0/24&#10;10.0.0.1&#10;203.0.113.0/24" rows={4} />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="block-mode" checked={isBlockMode} onCheckedChange={setIsBlockMode} />
                  <Label htmlFor="block-mode">{isBlockMode ? "Block listed IPs" : "Allow listed IPs only"}</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case "guest":
        return (
          <Card className="mt-4">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium">Invitation Links</h4>
                  <Dialog open={isCreateLinkOpen} onOpenChange={setIsCreateLinkOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Link
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create Invitation Link</DialogTitle>
                        <DialogDescription>
                          Generate a temporary link for guest access to this environment.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="link-name">Link Name</Label>
                          <Input
                            id="link-name"
                            value={newLinkName}
                            onChange={(e) => setNewLinkName(e.target.value)}
                            placeholder="e.g., Client Review"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="expires-in">Expires In</Label>
                          <Select value={newLinkExpiry} onValueChange={setNewLinkExpiry}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select expiry" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1 day">1 day</SelectItem>
                              <SelectItem value="7 days">7 days</SelectItem>
                              <SelectItem value="30 days">30 days</SelectItem>
                              <SelectItem value="90 days">90 days</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="scope">Scope</Label>
                          <Select value={newLinkScope} onValueChange={setNewLinkScope}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select permissions" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="view">View only</SelectItem>
                              <SelectItem value="comment">View & Comment</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateLinkOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={createGuestLink}>Create Link</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                {guestLinks.length > 0 && (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Expires</TableHead>
                        <TableHead>Scope</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {guestLinks.map((link) => (
                        <TableRow key={link.id}>
                          <TableCell className="font-medium">{link.name}</TableCell>
                          <TableCell>{link.expiresIn}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{link.scope}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={link.status === "active" ? "default" : "destructive"}>{link.status}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => copyLink(link.id)}>
                                <Copy className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => revokeLink(link.id)}>
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </CardContent>
          </Card>
        )

      case "geo":
        return (
          <Card className="mt-4">
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Allowed Countries</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border rounded">
                    {countries.map((country) => (
                      <div key={country} className="flex items-center space-x-2">
                        <Checkbox
                          id={country}
                          checked={selectedCountries.includes(country)}
                          onCheckedChange={() => handleCountryToggle(country)}
                        />
                        <Label htmlFor={country} className="text-sm">
                          {country}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Days of Week</Label>
                  <div className="flex flex-wrap gap-2">
                    {daysOfWeek.map((day) => (
                      <div key={day} className="flex items-center space-x-2">
                        <Checkbox
                          id={day}
                          checked={selectedDays.includes(day)}
                          onCheckedChange={() => handleDayToggle(day)}
                        />
                        <Label htmlFor={day} className="text-sm">
                          {day}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="time-from">From Time</Label>
                    <Input id="time-from" type="time" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time-to">To Time</Label>
                    <Input id="time-to" type="time" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-sm text-gray-500">
                  <span>Settings</span>
                  <ChevronRight className="h-4 w-4 mx-2" />
                  <span>Environment</span>
                  <ChevronRight className="h-4 w-4 mx-2" />
                  <span className="text-gray-900 font-medium">Access Control</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {/* Page Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ChevronLeft className="h-5 w-5 text-gray-400" />
                <h1 className="text-2xl font-semibold text-gray-900">Access Control</h1>
              </div>
              <p className="text-gray-600">
                Configure how users can access this environment. Choose from various authentication and authorization
                methods.
              </p>
            </div>

            {/* Access Control Options */}
            <Card>
              <CardHeader>
                <CardTitle>Access Control Method</CardTitle>
                <CardDescription>Select how you want to control access to this environment</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
                  <div className="space-y-3">
                    {accessControlOptions.map((option) => {
                      const IconComponent = option.icon
                      return (
                        <div
                          key={option.id}
                          className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <IconComponent className="h-4 w-4 text-gray-500" />
                              <Label htmlFor={option.id} className="font-medium cursor-pointer">
                                {option.label}
                              </Label>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info className="h-4 w-4 text-gray-400" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="max-w-xs">{option.description}</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Configuration Form */}
            {selectedOption !== "none" && renderConfigurationForm()}

            {/* Save Button */}
            <div className="flex justify-end pt-6 border-t">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
