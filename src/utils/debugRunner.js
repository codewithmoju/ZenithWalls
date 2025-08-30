/**
 * Debug Runner for ZenithWalls Screens
 * Run this to test all three screens and identify any issues
 */

import TestUtils from './testUtils';
import { Alert } from 'react-native';

export class DebugRunner {
  static async runScreenTests() {
    try {
      console.log('🔧 ZenithWalls Screen Debugger Started');
      console.log('=====================================\n');

      // Run comprehensive tests
      const testResults = await TestUtils.runAllTests();

      // Check for critical issues
      const criticalIssues = this.checkCriticalIssues(testResults.results);
      
      if (criticalIssues.length > 0) {
        console.log('\n🚨 Critical Issues Found:');
        criticalIssues.forEach(issue => console.log(`  - ${issue}`));
      }

      // Provide recommendations
      const recommendations = this.getRecommendations(testResults.results);
      if (recommendations.length > 0) {
        console.log('\n💡 Recommendations:');
        recommendations.forEach(rec => console.log(`  - ${rec}`));
      }

      console.log('\n✨ Debug session completed!');
      
      return {
        success: testResults.successRate === 100,
        results: testResults,
        criticalIssues,
        recommendations
      };

    } catch (error) {
      console.error('❌ Debug runner failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  static checkCriticalIssues(results) {
    const issues = [];

    // Check PreviewScreen issues
    if (!results.PreviewScreen.imageAnalysis) {
      issues.push('PreviewScreen: Image analysis not working - wallpaper quality detection may fail');
    }
    if (!results.PreviewScreen.downloadFunction) {
      issues.push('PreviewScreen: Download functionality compromised - users cannot save wallpapers');
    }
    if (!results.PreviewScreen.gestureHandling) {
      issues.push('PreviewScreen: Gesture handling failed - interactive preview may not work');
    }

    // Check ProfileScreen issues
    if (!results.ProfileScreen.contextAccess) {
      issues.push('ProfileScreen: Context access failed - profile data may not load');
    }
    if (!results.ProfileScreen.navigation) {
      issues.push('ProfileScreen: Navigation broken - users cannot navigate between screens');
    }

    // Check EditProfileScreen issues
    if (!results.EditProfileScreen.formValidation) {
      issues.push('EditProfileScreen: Form validation failed - invalid data may be saved');
    }
    if (!results.EditProfileScreen.imagePicker) {
      issues.push('EditProfileScreen: Image picker not working - users cannot change profile photos');
    }

    return issues;
  }

  static getRecommendations(results) {
    const recommendations = [];

    // General recommendations
    recommendations.push('Ensure all required permissions are granted before using features');
    recommendations.push('Test on both iOS and Android devices for platform-specific issues');
    recommendations.push('Verify internet connection for wallpaper downloads and API calls');

    // Specific recommendations based on results
    if (!results.PreviewScreen.wallpaperSetting) {
      recommendations.push('Request media library permissions before attempting wallpaper operations');
    }

    if (!results.ProfileScreen.hapticFeedback) {
      recommendations.push('Check if haptic feedback is available on the test device');
    }

    if (!results.EditProfileScreen.profileUpdate) {
      recommendations.push('Verify ProfileContext is properly initialized and available');
    }

    return recommendations;
  }

  static async quickHealthCheck() {
    console.log('⚡ Quick Health Check Starting...\n');

    const checks = [
      {
        name: 'React Native Gesture Handler',
        test: () => {
          try {
            require('react-native-gesture-handler');
            return true;
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Expo FileSystem',
        test: () => {
          try {
            require('expo-file-system');
            return true;
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Expo MediaLibrary',
        test: () => {
          try {
            require('expo-media-library');
            return true;
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'React Navigation',
        test: () => {
          try {
            require('@react-navigation/native');
            return true;
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Expo Haptics',
        test: () => {
          try {
            require('expo-haptics');
            return true;
          } catch (error) {
            return false;
          }
        }
      }
    ];

    let allPassed = true;
    checks.forEach(check => {
      const passed = check.test();
      console.log(`${passed ? '✅' : '❌'} ${check.name}`);
      if (!passed) allPassed = false;
    });

    console.log(`\n${allPassed ? '🎉' : '⚠️'} Health check ${allPassed ? 'passed' : 'failed'}`);
    return allPassed;
  }
}

export default DebugRunner;
