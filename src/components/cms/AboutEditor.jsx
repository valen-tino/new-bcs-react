import React, { useState, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useCMS } from '../../contexts/CMSContext';
import { toast } from 'react-toastify';
import AboutDescriptionMigrator from './AboutDescriptionMigrator';

function AboutEditor() {
  const { about, team, updateAbout, updateTeam, addTeamMember, deleteTeamMember } = useCMS();
  const [activeTab, setActiveTab] = useState('about');
  const [activeLanguage, setActiveLanguage] = useState('English');
  const [selectedMember, setSelectedMember] = useState(null);
  const [isEditingMember, setIsEditingMember] = useState(false);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [loading, setLoading] = useState(false);
  const editorRef = useRef(null);
  
  const [aboutData, setAboutData] = useState({
    image: about?.image || '',
    heading: {
      English: about?.heading?.English || 'About Us',
      Indonesian: about?.heading?.Indonesian || 'Tentang Kami'
    },
    description: {
      English: about?.description?.English || about?.description || '',
      Indonesian: about?.description?.Indonesian || ''
    }
  });

  const [memberData, setMemberData] = useState({
    name: '',
    position: '',
    image: '',
    description: ''
  });

  const handleSaveAbout = async () => {
    setLoading(true);
    try {
      await updateAbout(aboutData);
      toast.success('About section updated successfully');
    } catch (error) {
      toast.error('Failed to update about section');
    } finally {
      setLoading(false);
    }
  };

  const handleDescriptionChange = (content) => {
    setAboutData(prev => ({
      ...prev,
      description: {
        ...prev.description,
        [activeLanguage]: content
      }
    }));
  };

  const handleHeadingChange = (value) => {
    setAboutData(prev => ({
      ...prev,
      heading: {
        ...prev.heading,
        [activeLanguage]: value
      }
    }));
  };

  const handleEditMember = (member) => {
    setSelectedMember(member);
    setMemberData({
      name: member.name,
      position: member.position,
      image: member.image,
      description: member.description
    });
    setIsEditingMember(true);
    setIsAddingMember(false);
  };

  const handleAddMember = () => {
    setMemberData({
      name: '',
      position: '',
      image: '',
      description: ''
    });
    setSelectedMember(null);
    setIsEditingMember(false);
    setIsAddingMember(true);
  };

  const handleCancelMember = () => {
    setIsEditingMember(false);
    setIsAddingMember(false);
    setSelectedMember(null);
    setMemberData({ name: '', position: '', image: '', description: '' });
  };

  const handleSaveMember = async () => {
    if (!memberData.name.trim()) {
      toast.error('Member name is required');
      return;
    }

    setLoading(true);
    try {
      if (isAddingMember) {
        await addTeamMember(memberData);
        toast.success('Team member added successfully');
      } else {
        await updateTeam(selectedMember.id, memberData);
        toast.success('Team member updated successfully');
      }
      handleCancelMember();
    } catch (error) {
      toast.error('Failed to save team member');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMember = async (member) => {
    if (window.confirm(`Are you sure you want to delete ${member.name}?`)) {
      setLoading(true);
      try {
        await deleteTeamMember(member.id);
        toast.success('Team member deleted successfully');
        if (selectedMember?.id === member.id) {
          handleCancelMember();
        }
      } catch (error) {
        toast.error('Failed to delete team member');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">About Us</h2>
        <p className="mt-1 text-sm text-gray-600">
          Manage the About Us section including bilingual content and team members.
        </p>
      </div>

      {/* Migration Notice */}
      <AboutDescriptionMigrator />

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px space-x-8">
          <button
            onClick={() => setActiveTab('about')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'about'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            About Content
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'team'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Team Members
          </button>
        </nav>
      </div>

      {/* About Content Tab */}
      {activeTab === 'about' && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">About Us Content</h3>
              
              {/* Language Toggle */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Language:</span>
                <div className="flex bg-gray-100 rounded-md p-1">
                  <button
                    onClick={() => setActiveLanguage('English')}
                    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                      activeLanguage === 'English'
                        ? 'bg-white text-orange-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    🇺🇸 English
                  </button>
                  <button
                    onClick={() => setActiveLanguage('Indonesian')}
                    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                      activeLanguage === 'Indonesian'
                        ? 'bg-white text-orange-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    🇮🇩 Indonesian
                  </button>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Main Image URL</label>
                <input
                  type="url"
                  value={aboutData.image}
                  onChange={(e) => setAboutData({ ...aboutData, image: e.target.value })}
                  className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  placeholder="Enter image URL"
                />
                {aboutData.image && (
                  <div className="mt-2">
                    <img src={aboutData.image} alt="About preview" className="object-cover w-auto h-32 rounded-md" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Section Heading ({activeLanguage})
                </label>
                <input
                  type="text"
                  value={aboutData.heading[activeLanguage]}
                  onChange={(e) => handleHeadingChange(e.target.value)}
                  className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  placeholder={`Enter heading in ${activeLanguage}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description ({activeLanguage})
                </label>
                <Editor
                  apiKey="qi0nenw5umgv10sw07bvpjtaftf20chbphdm63kytqo8xzvx"
                  onInit={(evt, editor) => editorRef.current = editor}
                  value={aboutData.description[activeLanguage]}
                  onEditorChange={handleDescriptionChange}
                  init={{
                    height: 400,
                    menubar: false,
                    plugins: [
                      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                      'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                    ],
                    toolbar: 'undo redo | blocks | ' +
                      'bold italic forecolor | alignleft aligncenter ' +
                      'alignright alignjustify | bullist numlist outdent indent | ' +
                      'removeformat | help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                  }}
                />
              </div>

              {/* Preview other language */}
              {activeLanguage === 'English' && aboutData.description.Indonesian && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">🇮🇩 Indonesian Preview:</h4>
                  <div className="text-sm text-blue-700 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: aboutData.description.Indonesian }}></div>
                </div>
              )}
              
              {activeLanguage === 'Indonesian' && aboutData.description.English && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-green-800 mb-2">🇺🇸 English Preview:</h4>
                  <div className="text-sm text-green-700 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: aboutData.description.English }}></div>
                </div>
              )}

              <div className="flex justify-between items-center pt-4">
                <div className="text-sm text-gray-500">
                  Currently editing: <span className="font-medium">{activeLanguage}</span>
                </div>
                <button
                  onClick={handleSaveAbout}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md border border-transparent shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save About Content'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Team Members Tab */}
      {activeTab === 'team' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Team Members List */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Team Members</h3>
                <button
                  onClick={handleAddMember}
                  className="inline-flex items-center px-3 py-1 text-sm font-medium text-white bg-orange-600 rounded-md border border-transparent hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  <svg className="mr-1 -ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Member
                </button>
              </div>
              
              <div className="space-y-3">
                {team?.map((member) => (
                  <div key={member.id} className="flex justify-between items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <img src={member.image} alt={member.name} className="object-cover w-10 h-10 rounded-full" />
                      <div>
                        <div className="font-medium text-gray-900">{member.name}</div>
                        <div className="text-sm text-gray-500">{member.position}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditMember(member)}
                        className="text-sm font-medium text-orange-600 hover:text-orange-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteMember(member)}
                        className="text-sm font-medium text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {(!team || team.length === 0) && (
                  <p className="py-8 text-center text-gray-500">No team members added yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Member Editor */}
          {(isEditingMember || isAddingMember) && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="mb-4 text-lg font-medium text-gray-900">
                  {isAddingMember ? 'Add New Team Member' : `Edit ${selectedMember?.name}`}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      value={memberData.name}
                      onChange={(e) => setMemberData({ ...memberData, name: e.target.value })}
                      className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                      placeholder="Enter member name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Position</label>
                    <input
                      type="text"
                      value={memberData.position}
                      onChange={(e) => setMemberData({ ...memberData, position: e.target.value })}
                      className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                      placeholder="Enter position/role"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Image URL</label>
                    <input
                      type="url"
                      value={memberData.image}
                      onChange={(e) => setMemberData({ ...memberData, image: e.target.value })}
                      className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                      placeholder="Enter image URL"
                    />
                    {memberData.image && (
                      <div className="mt-2">
                        <img src={memberData.image} alt="Member preview" className="object-cover w-20 h-20 rounded-full" />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={memberData.description}
                      onChange={(e) => setMemberData({ ...memberData, description: e.target.value })}
                      rows={4}
                      className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                      placeholder="Enter member description"
                    />
                  </div>

                  <div className="flex justify-end pt-4 space-x-3">
                    <button
                      onClick={handleCancelMember}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveMember}
                      disabled={loading}
                      className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md border border-transparent shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save Member'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AboutEditor;