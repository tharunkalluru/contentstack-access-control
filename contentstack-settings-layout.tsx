"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  ChevronDown,
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
  Bell,
  HelpCircle,
  Grid3X3,
  Settings,
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

function AccessControlContent() {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
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

  const handleOptionToggle = (optionId: string) => {
    if (optionId === "none") {
      // If "None" is selected, clear all other selections
      setSelectedOptions(selectedOptions.includes("none") ? [] : ["none"])
    } else {
      // If any other option is selected, remove "none" and toggle the option
      const newSelections = selectedOptions.filter((id) => id !== "none")
      if (newSelections.includes(optionId)) {
        setSelectedOptions(newSelections.filter((id) => id !== optionId))
      } else {
        setSelectedOptions([...newSelections, optionId])
      }
    }
  }

  const renderInlineConfiguration = (optionId: string) => {
    if (!selectedOptions.includes(optionId)) return null

    const getConfigContent = () => {
      switch (optionId) {
        case "password":
          return (
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
          )

        case "contentstack":
          return (
            <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-lg">
              <Info className="h-4 w-4 text-blue-600" />
              <p className="text-sm text-blue-800">
                Uses existing Contentstack session and role permissions. No additional configuration required.
              </p>
            </div>
          )

        case "sso":
          return (
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
          )

        case "email":
          return (
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
          )

        case "ip":
          return (
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
          )

        case "guest":
          return (
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
          )

        case "geo":
          return (
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
          )

        default:
          return null
      }
    }

    return (
      <div className="mt-4 ml-8 p-4 bg-gray-50 rounded-lg border-l-4 border-purple-200 animate-in slide-in-from-top-2 duration-300">
        {getConfigContent()}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-gray-600 mb-6">
          Configure advanced access control for this environment. You can select multiple authentication methods to
          create layered security. Configuration options will appear below each selected method.
        </p>

        <div className="space-y-1">
          {accessControlOptions.map((option) => {
            const IconComponent = option.icon
            const isSelected = selectedOptions.includes(option.id)
            const isNoneSelected = selectedOptions.includes("none")
            const isDisabled = option.id !== "none" && isNoneSelected

            return (
              <div key={option.id} className="space-y-0">
                <div
                  className={`flex items-start space-x-3 p-4 rounded-lg transition-all duration-200 ${
                    isDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50 cursor-pointer"
                  } ${isSelected ? "bg-purple-50 border border-purple-200 shadow-sm" : "border border-transparent"}`}
                  onClick={() => !isDisabled && handleOptionToggle(option.id)}
                >
                  <Checkbox
                    id={option.id}
                    checked={isSelected}
                    disabled={isDisabled}
                    onCheckedChange={() => handleOptionToggle(option.id)}
                    className="mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <IconComponent className={`h-4 w-4 ${isSelected ? "text-purple-600" : "text-gray-500"}`} />
                      <Label
                        htmlFor={option.id}
                        className={`font-medium ${isDisabled ? "cursor-not-allowed" : "cursor-pointer"} ${
                          isSelected ? "text-purple-900" : "text-gray-900"
                        }`}
                      >
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
                    <p className={`text-sm mt-1 ${isSelected ? "text-purple-700" : "text-gray-500"}`}>
                      {option.description}
                    </p>
                  </div>
                </div>

                {/* Inline Configuration */}
                {renderInlineConfiguration(option.id)}
              </div>
            )
          })}
        </div>
      </div>

      {selectedOptions.length > 1 && (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-blue-900">Active Security Layers</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedOptions.map((optionId) => {
              const option = accessControlOptions.find((opt) => opt.id === optionId)
              return (
                <Badge key={optionId} variant="secondary" className="bg-blue-100 text-blue-800">
                  {option?.label}
                </Badge>
              )
            })}
          </div>
          <p className="text-sm text-blue-700">
            Users will need to satisfy all selected authentication methods to access this environment.
          </p>
        </div>
      )}
    </div>
  )
}

export default function ContentstackSettingsLayout() {
  const [activeTab, setActiveTab] = useState("access-control")

  const tabs = [
    { id: "general", label: "General" },
    { id: "environment-variables", label: "Environment Variables" },
    { id: "domains", label: "Domains" },
    { id: "deploy-hooks", label: "Deploy Hooks" },
    { id: "deployments", label: "Deployments" },
    { id: "access-control", label: "Access Control" },
    { id: "cache-priming", label: "Cache Priming" },
    { id: "event-tracking", label: "Event Tracking" },
  ]

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Top Navigation */}
        <div className="bg-white border-b">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-purple-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">L</span>
                </div>
                <span className="font-medium">Launch</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <div className="w-5 h-5 border border-gray-300 rounded flex items-center justify-center">
                  <span className="text-xs">E</span>
                </div>
                <span>Environments</span>
              </div>
              <div className="flex items-center space-x-2 text-purple-600">
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Bell className="w-5 h-5 text-gray-600" />
              <HelpCircle className="w-5 h-5 text-gray-600" />
              <Grid3X3 className="w-5 h-5 text-gray-600" />
              <div className="flex items-center space-x-2">
                <span className="text-purple-600 font-medium">CONTENTSTACK</span>
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">TK</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Left Sidebar */}
          <div className="w-64 bg-white border-r min-h-screen">
            <div className="p-4">
              <div className="text-sm text-gray-600 mb-4">kickstart-next-graphql</div>
              <div className="space-y-1">
                <div className="text-sm font-medium text-gray-900 mb-3">Settings</div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 p-2 text-gray-600 hover:bg-gray-50 rounded">
                    <Info className="w-4 h-4" />
                    <span className="text-sm">General</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 text-gray-600 hover:bg-gray-50 rounded">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">Users</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 text-purple-600 bg-purple-50 rounded">
                    <div className="w-4 h-4 bg-purple-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs">E</span>
                    </div>
                    <span className="text-sm font-medium">Environments</span>
                    <ChevronDown className="w-4 h-4 ml-auto" />
                  </div>
                  <div className="flex items-center space-x-2 p-2 text-gray-600 hover:bg-gray-50 rounded">
                    <div className="w-4 h-4 border border-gray-300 rounded"></div>
                    <span className="text-sm">Stack Integration</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="p-6">
              {/* Page Header */}
              <div className="flex items-center gap-2 mb-6">
                <ChevronLeft className="h-5 w-5 text-gray-400" />
                <h1 className="text-xl font-semibold text-gray-900">Environments</h1>
                <HelpCircle className="h-4 w-4 text-gray-400" />
              </div>

              {/* Environment Selector */}
              <div className="mb-6">
                <Label className="text-sm text-gray-600 mb-2 block">
                  Select an Environment <span className="text-red-500">(required)</span>
                </Label>
                <Select defaultValue="default">
                  <SelectTrigger className="w-full max-w-md">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="staging">Staging</SelectItem>
                    <SelectItem value="production">Production</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tab Navigation */}
              <div className="border-b mb-6">
                <div className="flex space-x-8 overflow-x-auto">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                        activeTab === tab.id
                          ? "border-purple-600 text-purple-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="max-w-4xl">
                {activeTab === "access-control" && <AccessControlContent />}
                {activeTab === "general" && (
                  <div className="text-gray-600">General settings content would go here...</div>
                )}
                {activeTab === "environment-variables" && (
                  <div className="text-gray-600">Environment variables content would go here...</div>
                )}
                {/* Add other tab contents as needed */}
              </div>

              {/* Save Button */}
              {activeTab === "access-control" && (
                <div className="flex justify-end pt-6 border-t mt-8">
                  <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
