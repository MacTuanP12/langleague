import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, CardBody, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppSelector } from 'app/config/store';
import { toast } from 'react-toastify';
import { translate, Translate } from 'react-jhipster';
import { useUserProfile } from 'app/shared/reducers/hooks';
import '../student.scss';
import './student-profile.scss';

export const StudentProfile = () => {
  const { userProfile, loading, editProfile, loadCurrentProfile } = useUserProfile();
  const account = useAppSelector(state => state.authentication.account);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    bio: '',
    imageUrl: '',
  });

  useEffect(() => {
    loadCurrentProfile();
  }, [loadCurrentProfile]);

  useEffect(() => {
    if (account) {
      setFormData({
        fullName: `${account.firstName || ''} ${account.lastName || ''}`.trim() || account.login,
        email: account.email || '',
        username: account.login || '',
        bio: userProfile?.bio || '',
        imageUrl: account.imageUrl || '',
      });
    }
  }, [account, userProfile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile) return;

    try {
      await editProfile({ ...userProfile, bio: formData.bio });
      toast.success(translate('langleague.student.profile.messages.success'));
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(translate('langleague.student.profile.messages.error'));
    }
  };

  const handlePhotoChange = () => {
    toast.info(translate('langleague.student.profile.messages.photoComingSoon'));
  };

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
                    src={formData.imageUrl}
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
              <Button color="secondary" outline onClick={handlePhotoChange} block>
                <FontAwesomeIcon icon="camera" className="me-2" />
                <Translate contentKey="langleague.student.profile.actions.changePhoto">Change Photo</Translate>
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
                    <FontAwesomeIcon icon="save" className="me-2" />
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
