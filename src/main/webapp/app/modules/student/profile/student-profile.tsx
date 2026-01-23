import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, CardBody, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppSelector, useAppDispatch } from 'app/config/store';
import { toast } from 'react-toastify';
import { translate, Translate } from 'react-jhipster';
import { useUserProfile } from 'app/shared/reducers/hooks';
import { getSession, updateAvatar } from 'app/shared/reducers/authentication';
import { saveAccountSettings } from 'app/modules/account/settings/settings.reducer';
import axios from 'axios';
import './student-profile.scss';
import { processImageUrl } from 'app/shared/util/image-utils';

export const StudentProfile = () => {
  const dispatch = useAppDispatch();
  const { userProfile, loading, loadCurrentProfile } = useUserProfile();
  const account = useAppSelector(state => state.authentication.account);
  const avatarLoading = useAppSelector(state => state.authentication.loading);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    bio: '',
    imageUrl: '',
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadCurrentProfile();
  }, [loadCurrentProfile]);

  useEffect(() => {
    if (account) {
      setFormData({
        fullName: `${account.firstName || ''} ${account.lastName || ''}`.trim() || account.login,
        email: account.email || '',
        username: account.login || '',
        bio: account.bio || '', // Get bio from account
        imageUrl: account.imageUrl || '',
      });
    }
  }, [account]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) return;

    try {
      // Split fullName into firstName and lastName
      const nameParts = formData.fullName.trim().split(/\s+/);
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Process image URL before saving
      const processedImageUrl = processImageUrl(formData.imageUrl);

      // Create the updated account object with all changes
      const updatedAccount = {
        ...account,
        firstName,
        lastName,
        email: formData.email, // Email is disabled, so this sends the original value
        bio: formData.bio, // Add bio to the main account update
        imageUrl: processedImageUrl,
      };

      // Dispatch the save action and wait for it to complete
      await dispatch(saveAccountSettings(updatedAccount)).unwrap();

      toast.success(translate('langleague.student.profile.messages.success'));
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(translate('langleague.student.profile.messages.error'));
    }
  };

  const handlePhotoChange = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB');
      return;
    }

    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      setUploading(true);
      // Upload via API
      const response = await axios.post('/api/upload/image', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const imageUrl = response.data.fileUrl;

      // Update avatar via API with the URL
      await dispatch(updateAvatar(imageUrl)).unwrap();

      // Update local form state
      setFormData(prev => ({
        ...prev,
        imageUrl,
      }));

      toast.success('Avatar updated successfully!');
    } catch (error) {
      console.error('Error updating avatar:', error);
      toast.error('Failed to update avatar');
    } finally {
      setUploading(false);
    }
  };

  if (!account) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Container fluid className="student-page-container">
      {/* Header */}
      <div className="student-header mb-4">
        <div className="header-content">
          <h1>
            <FontAwesomeIcon icon="user-circle" className="me-3" />
            <Translate contentKey="langleague.student.profile.title">My Profile</Translate>
          </h1>
          <p>
            <Translate contentKey="langleague.student.profile.subtitle">Manage your personal information</Translate>
          </p>
        </div>
      </div>

      <Row>
        {/* Profile Card */}
        <Col lg="4" md="12" className="mb-4">
          <Card className="learning-card text-center">
            <CardBody>
              <div className="mb-4">
                {formData.imageUrl ? (
                  <img
                    src={processImageUrl(formData.imageUrl)}
                    alt="Avatar"
                    className="rounded-circle"
                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    className="d-flex align-items-center justify-content-center rounded-circle bg-primary text-white mx-auto"
                    style={{ width: '150px', height: '150px', fontSize: '3rem' }}
                  >
                    {formData.username?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
              </div>
              <h4>{formData.fullName}</h4>
              <p className="text-muted">@{formData.username}</p>

              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileSelect} />
              <Button color="secondary" outline onClick={handlePhotoChange} block disabled={avatarLoading || uploading} className="mt-2">
                <FontAwesomeIcon icon={avatarLoading || uploading ? 'sync' : 'camera'} spin={avatarLoading || uploading} className="me-2" />
                <Translate contentKey="langleague.student.profile.actions.changePhoto">Upload Photo</Translate>
              </Button>
            </CardBody>
          </Card>

          {/* Stats Card */}
          <Card className="progress-card">
            <CardBody>
              <h5 className="mb-3">
                <FontAwesomeIcon icon="chart-line" className="me-2" />
                <Translate contentKey="langleague.student.profile.stats.title">Learning Stats</Translate>
              </h5>
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span>
                    <FontAwesomeIcon icon="book" className="me-2 text-primary" />
                    <Translate contentKey="langleague.student.profile.stats.booksEnrolled">Books Enrolled</Translate>
                  </span>
                  <strong>5</strong>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span>
                    <FontAwesomeIcon icon="fire" className="me-2 text-danger" />
                    <Translate contentKey="langleague.student.profile.stats.streak">Current Streak</Translate>
                  </span>
                  <strong>{userProfile?.streakCount || 0} days</strong>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span>
                    <FontAwesomeIcon icon="trophy" className="me-2 text-warning" />
                    <Translate contentKey="langleague.student.profile.stats.achievements">Achievements</Translate>
                  </span>
                  <strong>12</strong>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>

        {/* Profile Form */}
        <Col lg="8" md="12">
          <Card className="learning-card">
            <CardBody>
              <h5 className="mb-4">
                <FontAwesomeIcon icon="id-card" className="me-2" />
                <Translate contentKey="langleague.student.profile.personalInfo.title">Personal Information</Translate>
              </h5>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <Label for="fullName">
                        <FontAwesomeIcon icon="user" className="me-2" />
                        <Translate contentKey="langleague.student.profile.personalInfo.fullName">Full Name</Translate>
                      </Label>
                      <Input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder={translate('langleague.student.profile.personalInfo.fullNamePlaceholder')}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label for="email">
                        <FontAwesomeIcon icon="envelope" className="me-2" />
                        <Translate contentKey="langleague.student.profile.personalInfo.email">Email Address</Translate>
                      </Label>
                      <Input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} disabled />
                    </FormGroup>
                  </Col>
                </Row>

                <FormGroup>
                  <Label for="username">
                    <FontAwesomeIcon icon="at" className="me-2" />
                    <Translate contentKey="langleague.student.profile.personalInfo.username">Username</Translate>
                  </Label>
                  <Input type="text" id="username" name="username" value={formData.username} disabled />
                </FormGroup>

                <FormGroup>
                  <Label for="bio">
                    <FontAwesomeIcon icon="pen" className="me-2" />
                    <Translate contentKey="langleague.student.profile.personalInfo.bio">Bio</Translate>
                  </Label>
                  <Input
                    type="textarea"
                    id="bio"
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder={translate('langleague.student.profile.personalInfo.bioPlaceholder')}
                  />
                </FormGroup>

                <div className="d-flex gap-2 justify-content-end">
                  <Button color="secondary" outline type="button">
                    <Translate contentKey="langleague.student.profile.actions.cancel">Cancel</Translate>
                  </Button>
                  <Button color="primary" type="submit" disabled={loading}>
                    {loading ? <FontAwesomeIcon icon="sync" spin className="me-2" /> : <FontAwesomeIcon icon="save" className="me-2" />}
                    <Translate contentKey="langleague.student.profile.actions.saveChanges">Save Changes</Translate>
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default StudentProfile;
